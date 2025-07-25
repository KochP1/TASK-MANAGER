import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsInterface } from '../../services/projectServices/project';
import { ProjectService } from '../../services/projectServices/project';

@Component({
  selector: 'app-edit-project',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-project.html',
  styleUrl: './edit-project.css'
})
export class EditProject {
  projectEditForm: FormGroup
  projectId: number;
  project = signal<ProjectsInterface | null>(null);
  userData: any | null;
  private snackBar = inject(MatSnackBar)
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private projectService: ProjectService, private router: Router) {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.projectEditForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(1), 
        Validators.maxLength(20)
      ]],
      description: ['', [
        Validators.required, 
        Validators.minLength(1), 
        Validators.maxLength(90)
      ]],
      admin_id: ['', Validators.required]
    });
  };

  ngOnInit (): void {
    this.loadUser();
    this.getProject();

    if (this.userData) {
      this.projectEditForm.patchValue({
        admin_id: this.userData.id
      });
    }
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

  getProject(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.projectService.getProject(this.projectId).subscribe(
      {
        next: (project) => {
          this.project.set(project);
          this.projectEditForm.patchValue({
            name: this.project()?.name
          });
          this.projectEditForm.patchValue({
            description: this.project()?.description
          });
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Error al cargar proyectos');
          this.isLoading.set(false);
          this.snackBar.open(`Error al recuperar proyectos: ${err}`, 'X', {
            duration: 3000
          })
        }
      }
    )
  }

  onSubmit() {
    if (this.projectEditForm.invalid) {
      this.projectEditForm.markAllAsTouched();
      this.snackBar.open('Por favor complete el formulario correctamente', 'X', {
        duration: 3000
      });
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.projectService.updateProject(this.projectId, this.projectEditForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Proyecto actualizado correctamente', 'X', {
          duration: 3000
        });

        this.router.navigate(['/dashboard/']);
      },
      error: (err) => {
        this.error.set('Error al actualizar proyecto');
        this.snackBar.open(`Error al actualizar proyecto: ${err.message}`, 'X', {
          duration: 3000
        });
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
