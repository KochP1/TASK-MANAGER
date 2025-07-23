import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from './login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login],
  template: `<app-login/>`,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
}
