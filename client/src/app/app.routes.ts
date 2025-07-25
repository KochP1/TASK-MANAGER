import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Regist } from './regist/regist';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './guards/auth.guards';

export const routes: Routes = [
    {path: '', component: Login},
    {path: 'regist', component: Regist},
    {path: 'dashboard', component: Dashboard, children: [
        {
            path: '',
            loadComponent: () => import('./dashboard/projects/projects').then((m => m.Projects) )
        },

        {
            path: 'acerca_de',
            loadComponent: () => import('./dashboard/acerca-de/acerca-de').then((m => m.AcercaDe) )
        }
    ]}
];
