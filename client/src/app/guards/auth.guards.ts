import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () => {
    const authService = inject(Auth);
    
    // Solo verifica el token sin redirigir
    return !authService.isTokenExpired();
};