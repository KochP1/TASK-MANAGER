import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '../../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css'
})
export class EditUser {
  userForm: FormGroup;
  projectId: number;
  private snackBar = inject(MatSnackBar)
  isLoading = signal(false);
  error = signal<string | null>(null);
  constructor(private fb: FormBuilder, private authService: Auth, private route: ActivatedRoute) {
      this.projectId = Number(this.route.snapshot.paramMap.get('id'));
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
    })
  }
}
