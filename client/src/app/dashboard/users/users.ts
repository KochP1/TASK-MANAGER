import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../services/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {
  userForm: FormGroup
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

  constructor(private authService: Auth, private fb: FormBuilder, private router: Router) {
    this.userForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
      ]],
      lastName: ['' ,[
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(12)
      ]],
      role: ['user', [
        Validators.required
      ]]
    })
  }

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

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      this.authService.register(this.userForm.value).subscribe({
          next: (response) => {
            this.showSuccess('Usuario creado');
            this.loadUsers();
          },
          error: (err) => {
            this.showError(`Error al eliminar usuario: ${err.message}`);
            this.error.set(err.message || 'Error durante el registro')
          },
          complete: () => {
            this.isLoading.set(false);
        }
    });
    }
  }

  editUser(id: number) {
    this.router.navigate(['/dashboard/edit_users', id]);
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
