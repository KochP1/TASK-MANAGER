import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjectService, ProjectsInterface } from '../../services/projectServices/project';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-projects',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  standalone: true,
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit{
  projectForm: FormGroup;
  userData: any | null;

  projects = signal<ProjectsInterface[] | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  private snackBar = inject(MatSnackBar);

  constructor(private projectService: ProjectService, private router: Router, private fb: FormBuilder) {
    this.projectForm = this.fb.group({
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
    this.getProjects();
    this.loadUser();

    if (this.userData) {
    this.projectForm.patchValue({
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

  getProjects(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.projectService.getProjects().subscribe(
      {
        next: (projects) => {
          this.projects.set(projects);
          console.log(this.projects())
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

  onSubmit(): void {
      console.log('Form submitted', this.projectForm.value);
    console.log('Form valid:', this.projectForm.valid);
    console.log('Form errors:', this.projectForm.errors);
    console.log('Name errors:', this.projectForm.get('name')?.errors);
    console.log('Description errors:', this.projectForm.get('description')?.errors);
    if (this.projectForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      this.projectService.createProject(this.projectForm.value).subscribe(
      {
        next: (response) => {
          this.snackBar.open('Proyecto creado', 'X', {
            duration: 3000
          });
          this.getProjects();
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Error al crear proyectos');
          this.isLoading.set(false);
          this.snackBar.open(`Error al crear proyectos: ${err}`, 'X', {
            duration: 3000
          })
        }
      }
    )
    }
  }

  editProject(projectId: number) {
    this.router.navigate(['/dashboard/edit_project', projectId]);
  }

  delete(id: number): void {
    if (confirm('¿Estás seguro de eliminar el proyecto?')) {
      this.isLoading.set(true);
      this.error.set(null);

      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.snackBar.open('Proyecto eliminado', 'X', { duration: 3000 });
          this.getProjects();
        },
        error: (err) => {
          this.error.set(`Error: ${err.message}`);
          this.snackBar.open('Error al eliminar proyecto', 'X', { duration: 3000 });
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

}
