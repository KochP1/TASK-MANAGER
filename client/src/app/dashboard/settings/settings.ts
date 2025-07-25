import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../services/auth';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  settingsForm: FormGroup;
  settingsPasswordForm: FormGroup;

  private snackBar = inject(MatSnackBar);
  userData: any | null;
  user = signal<User | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.settingsForm = this.fb.group({
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
    });

    this.settingsPasswordForm = this.fb.group({
      currentPassword: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(12)
      ]],

      newPassword: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(12)
      ]]
    })
  }

  ngOnInit (): void {
    this.loadUser();

    if (!this.userData) {
      this.router.navigate(['/']);
    }

    this.getUser(this.userData.id);
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

  getUser(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.authService.getUserById(id).subscribe(
      {
        next: (user) => {
          this.user.set(user);
          this.settingsForm.patchValue({
            name: this.user()?.name,
            lastName: this.user()?.lastName,
            email: this.user()?.email,
          });
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Error obteniendo el usuario');
          this.isLoading.set(false);
          this.showError('Error obteniendo el usuario: ' + err.message)
        }
      }
    )
  }

  onSubmit(id: number) {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      this.snackBar.open('Por favor complete el formulario correctamente', 'X', {
        duration: 3000
      });
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.updateUser(id, this.settingsForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Usuario actualizado correctamente', 'X', {
          duration: 3000
        });
      },
      error: (err) => {
        this.error.set('Error al actualizar usuario');
        this.snackBar.open(`Error al actualizar usuario: ${err.message}`, 'X', {
          duration: 3000
        });
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  changePassword(id: number): void {
    if (this.settingsPasswordForm.invalid) {
      this.settingsPasswordForm.markAllAsTouched();
      this.snackBar.open('Por favor complete el formulario correctamente', 'X', {
        duration: 3000
      });
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    
    this.authService.updatePassword(id, this.settingsPasswordForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Contrasña actualizado correctamente', 'X', {
          duration: 3000
        });

        this.authService.logout().subscribe();
        
      },
      error: (err) => {
        this.error.set('Error al actualizar usuario');
        this.snackBar.open(`Error al actualizar usuario: ${err.message}`, 'X', {
          duration: 3000
        });
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
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
