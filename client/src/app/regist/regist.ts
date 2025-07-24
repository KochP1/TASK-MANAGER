import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../services/auth';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-regist',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './regist.html',
  styleUrl: './regist.css'
})
export class Regist {
  registForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.registForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['admin', Validators.required]
    });
  }

  onSubmit() {
    if (this.registForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      

      this.authService.register(this.registForm.value).subscribe({
          next: (response) => {
            console.log('Registro exitoso', response);
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Error en registro', err);
            this.errorMessage = err.message || 'Error durante el registro';
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
        }
    });
    }
  }
}
