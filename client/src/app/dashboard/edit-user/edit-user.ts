import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../services/auth';

@Component({
  selector: 'app-edit-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css'
})
export class EditUser {
  userForm: FormGroup;
  id: number;
  user = signal<User | null>(null);
  private snackBar = inject(MatSnackBar)
  isLoading = signal(false);
  error = signal<string | null>(null);
  constructor(private fb: FormBuilder, private authService: Auth, private route: ActivatedRoute, private router: Router) {
      this.id = Number(this.route.snapshot.paramMap.get('id'));
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
        role: ['user', [
          Validators.required
        ]]
    });
  }

  ngOnInit(): void {
    this.getUser();
  };

  getUser(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.authService.getUserById(this.id).subscribe(
      {
        next: (user) => {
          this.user.set(user);
          this.userForm.patchValue({
            name: this.user()?.name,
            lastName: this.user()?.lastName,
            email: this.user()?.email,
            role: this.user()?.role
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

  onSubmit() {
      if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.snackBar.open('Por favor complete el formulario correctamente', 'X', {
        duration: 3000
      });
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.authService.updateUser(this.id, this.userForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Usuario actualizado correctamente', 'X', {
          duration: 3000
        });

        this.router.navigate(['/dashboard/users']);
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
}
