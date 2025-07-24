import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-regist',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './regist.html',
  styleUrl: './regist.css'
})
export class Regist {
  registForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registForm.valid) {
      console.log(this.registForm.value)
    }
  }
}
