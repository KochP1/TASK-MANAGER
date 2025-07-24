import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
import { Content } from '../content/content';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Sidebar, Navbar, Content],
  template: '<div class="dashboard__wrapper"> <app-sidebar/> <div class="main-content"> <app-navbar/> <div class="content"> <app-content/> </div> </div> </div>',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  
}
