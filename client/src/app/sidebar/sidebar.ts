import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  constructor(private authService: Auth) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        //this.toastr.success('Sesión cerrada correctamente');
      },
      error: (err) => {
        console.error('Error en logout:', err);
      }
    });
  }
}
