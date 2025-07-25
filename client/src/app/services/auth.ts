import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { environment } from '../environments/enviroment';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role?: string;
}

interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: User;
  error?: string;
}

interface RefreshResponse {
  accessToken?: string
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private tokenKey = 'auth_token';
  private jwtHelper = new JwtHelperService();


  constructor(private http: HttpClient, private router: Router) {}

  private tokenExpired = signal(false);
  
  // Expone el estado como señal (readonly)
  isTokenExpired = this.tokenExpired.asReadonly();

  setTokenExpired(expired: boolean): void {
    this.tokenExpired.set(expired);
  }

  register(userData: {
    name: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    )
  }

  login(credentials: {email:string, password: string}): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuth(response)),
      catchError(this.handleError)
    )
  }

  refreshToken() {
    const refresh = this.getRefreshToken();

    if (!refresh) {
      this.router.navigate(['/']);
      return throwError(() => new Error('No autenticado'));
    };

    try {
      return this.http.post(`${this.apiUrl}/refresh`, refresh).pipe(
        tap(response => this.handleRefresh(response)),
        catchError(this.handleError)
      )
    } catch(parseError) {
      console.error('Error parsing user data:', parseError);
      this.logout();
      this.router.navigate(['/']);
      return throwError(() => new Error('Datos de usuario corruptos'));
    }
  }

  logout(): Observable<any> {
    const token = this.getToken();
    
    if (!token) {
      this.cleanUpAndRedirect();
      return throwError(() => new Error('No hay token almacenado'));
    }

    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      tap(() => {
        this.cleanUpAndRedirect();
      }),
      catchError(error => {
        this.cleanUpAndRedirect();
        return throwError(() => error);
      })
    );
  }

    private cleanUpAndRedirect(): void {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      this.router.navigate(['/']);

      // window.location.reload();
  }

  private handleAuth(response: AuthResponse): void {
    if (response.accessToken) {
      localStorage.setItem(this.tokenKey, response.accessToken);
    }

    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user))
    }

    if (response.refreshToken) {
      localStorage.setItem('refreshToken', JSON.stringify(response.refreshToken));
    }
  }

  private handleRefresh(response: RefreshResponse): void {
    localStorage.removeItem(this.tokenKey);

    if (response.accessToken) {
      localStorage.setItem(this.tokenKey, response.accessToken);
    }
  }

    // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
      let errorMessage = 'Error desconocido';
      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del servidor
        errorMessage = error.error?.message || error.statusText;
      }
      console.error('[AuthService] Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }


  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getUser(): string | null {
    return localStorage.getItem('user');
  }

  getUserById(id: number): Observable<User> {
    const token = this.getToken();
    
    if (!token) {
      this.router.navigate(['/']);
      return throwError(() => new Error('No autenticado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(`${this.apiUrl}/get_user/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }


  updateUser(id: number, userData: Partial<User>): Observable<User> {
    const token = this.getToken();
    
    if (!token) {
      this.router.navigate(['/']);
      return throwError(() => new Error('No autenticado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<User>(`${this.apiUrl}/update_user/${id}`, userData, { headers }).pipe(
      tap(updatedUser => {
        // Si el usuario actualizado es el mismo que está logueado, actualiza los datos en localStorage
        const currentUser = JSON.parse(this.getUser() || '{}');
        if (currentUser.id === updatedUser.id) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }),
      catchError(this.handleError)
    );
  }

  updatePassword(id: number, userData: {currentPassword: string, newPassword: string}): Observable<User> {
    const token = this.getToken();
    
    if (!token) {
      this.router.navigate(['/']);
      return throwError(() => new Error('No autenticado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.patch<User>(`${this.apiUrl}/update_password/${id}`, userData, { headers }).pipe(
      catchError(this.handleError)
    );
  }


  deleteUser(id: number): Observable<{ message: string }> {
    const token = this.getToken();
    
    if (!token) {
      this.router.navigate(['/']);
      return throwError(() => new Error('No autenticado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete_user/${id}`, { headers }).pipe(
      tap(() => {
        // Si el usuario eliminado es el mismo que está logueado, hacer logout
        const currentUser = JSON.parse(this.getUser() || '{}');
        if (currentUser.id === id) {
          this.logout().subscribe();
        }
      }),
      catchError(this.handleError)
    );
  }

  listUsers(): Observable<User[]> {
    const token = this.getToken();
    
    if (!token) {
      this.router.navigate(['/']);
      return throwError(() => new Error('No autenticado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User[]>(`${this.apiUrl}/list_users`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

}
