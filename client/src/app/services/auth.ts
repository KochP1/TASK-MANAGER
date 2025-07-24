import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { environment } from '../environments/enviroment';

interface User {
  name: string;
  lastName: string;
  email: string;
  role?: string;
}

interface AuthResponse {
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = `${environment.apiBaseUrl}/auth`;
  private tokenKey = 'auth_token';


  constructor(private http: HttpClient) {}

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
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => this.handleAuth(response)),
      catchError(this.handleError)
    )
  }

  private handleAuth(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem(this.tokenKey, response.token);
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

   // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Obtener token almacenado
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
