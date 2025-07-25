import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../services/auth';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {

  users = signal<User[] | null>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  userData: any | null;
  private snackBar = inject(MatSnackBar)

  newUser = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  };

  constructor(private authService: Auth) {}

  ngOnInit (): void {
    this.loadUser();
    this.loadUsers();
  }

  private loadUser(): void {
    const user = localStorage.getItem('user');

    if (user) {
      try {
        this.userData = JSON.parse(user);
      } catch(e) {
        this.snackBar.open('Error al obtener datos del usuario', 'X', {
          duration: 3000
        });
        this.userData = null;
      }
    }
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.authService.listUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar usuarios');
        this.isLoading.set(false);
        this.showError(`Error al cargar usuarios: ${err.message}`);
      }
    });
  }

    deleteUser(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.isLoading.set(true);
      
      this.authService.deleteUser(id).subscribe({
        next: () => {
          this.showSuccess('Usuario eliminado correctamente');
          this.loadUsers();
        },
        error: (err) => {
          this.showError(`Error al eliminar usuario: ${err.message}`);
          this.isLoading.set(false);
        }
      });
    }
  }

  private resetForm(): void {
    this.newUser = {
      name: '',
      lastName: '',
      email: '',
      password: '',
      role: 'user'
    };
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

}
