import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Sidebar, Navbar, RouterOutlet],
  template: '<div class="dashboard__wrapper"> <app-sidebar/> <div class="main-content"> <app-navbar/> <div class="content"> <router-outlet /> </div> </div> </div>',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private snackBar = inject(MatSnackBar);

  testToast() {
    this.snackBar.open('Mensaje de prueba', 'cerrar', {
      duration: 9000
    });
  }
}
