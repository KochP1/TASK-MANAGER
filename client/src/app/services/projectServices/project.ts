import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { catchError, Observable, throwError } from 'rxjs';

export interface ProjectsInterface {
  id: number
  name: string,
  description: string,
  admin_id: number
  createdAt?: string
}

interface ProjectResponse {
  projects: ProjectsInterface[]
  message?: string
  error?: string
}

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  private apiUrl = `${environment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient, private router: Router, private authService: Auth) {}

  createProject(projectData: {
    name: string,
    description: string,
    admin_id: number
  }) {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/']);
      return throwError(() => new Error('No autenticado'));
    }

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    return this.http.post(`${this.apiUrl}/create_project`, projectData, { headers }).pipe(
      catchError(error => {
        console.error('Error creating project:', error);
        return throwError(() => error);
      })
    )
  }

  deleteProject(id:number) {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/']);
      return throwError(() => new Error('No autenticado'));
    }

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/delete_project/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Error creating project:', error);
        return throwError(() => error);
      })
    )
  }
  
  getProjects(): Observable<ProjectsInterface[]> {
    const token = this.authService.getToken();
    const userData = this.authService.getUser();

    if (!token || !userData) {
      this.router.navigate(['/']);
      return throwError(() => new Error('No autenticado'));

    }

    try {
      const user = JSON.parse(userData);
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      return this.http.get<ProjectsInterface[]>(
        `${this.apiUrl}/get_project/${user.id}`,
        { headers }
      ).pipe(
        catchError(error => {
          console.error('Error fetching projects:', error);

          

          return throwError(() => error);
        })
      );
    } catch(parseError) {
      console.error('Error parsing user data:', parseError);
      return throwError(() => new Error('Datos de usuario corruptos'));
    }
  }

    getProject(id: number): Observable<ProjectsInterface> {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/']);
      return throwError(() => new Error('No autenticado'));

    }

    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      return this.http.get<ProjectsInterface>(
        `${this.apiUrl}/get_one_project/${id}`,
        { headers }
      ).pipe(
        catchError(error => {
          console.error('Error fetching projects:', error);
          return throwError(() => error);
        })
      );
    } catch(parseError) {
      console.error('Error parsing user data:', parseError);
      return throwError(() => new Error('Datos de usuario corruptos'));
    }
  }


  updateProject(id: number, projectData: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/edit_project/${id}`, projectData, { headers });
  }
}
