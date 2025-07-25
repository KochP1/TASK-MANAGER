import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(Auth);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
            // Marca el token como expirado
            authService.setTokenExpired(true);
            
            const snackBarRef = snackBar.open(
            'Tu sesión ha expirado', 
            'Refrescar sesión',
            {
                duration: 10000, // 10 segundos para decidir
                panelClass: ['error-snackbar']
            }
            );

            snackBarRef.onAction().subscribe(() => {
            authService.refreshToken().subscribe({
                next: () => {
                authService.setTokenExpired(false);
                window.location.reload(); // Recarga la app con nuevo token
                },
                error: () => {
                authService.logout();
                router.navigate(['/']);
                }
            });
            });

            snackBarRef.afterDismissed().subscribe(() => {
            if (authService.isTokenExpired()) {
                authService.logout();
                router.navigate(['/']);
            }
            });
        }
        return throwError(() => error);
        })
    );
};