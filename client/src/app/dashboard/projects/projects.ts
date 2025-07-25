import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjectService, ProjectsInterface } from '../../services/projectServices/project';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit{

  projects = signal<ProjectsInterface[] | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  private snackBar = inject(MatSnackBar);

  constructor(private projectService: ProjectService) {};

  ngOnInit (): void {
    this.getProjects();
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

}
