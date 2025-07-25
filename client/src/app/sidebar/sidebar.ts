import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth } from '../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private snackBar = inject(MatSnackBar);
  constructor(private authService: Auth) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.snackBar.open('Sesión cerrada', 'X', {
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Error en logout:', err);
      }
    });
  }
}
