import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
import { Content } from '../content/content';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Sidebar, Navbar, Content],
  template: '<div class="dashboard__wrapper"> <app-sidebar/> <div class="main-content"> <app-navbar/> <div class="content"> <app-content/></div> </div> </div>',
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
