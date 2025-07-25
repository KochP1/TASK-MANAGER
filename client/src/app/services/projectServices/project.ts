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
  createdAt: string
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

      console.log(user.id)
      console.log(`${this.apiUrl}/get_project/${user.id}`)
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
      //this.authService.logout();
      //this.router.navigate(['/']);
      return throwError(() => new Error('Datos de usuario corruptos'));
    }
  }
}
