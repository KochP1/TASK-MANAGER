import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Regist } from './regist/regist';

export const routes: Routes = [
    {path: '', component: Login},
    {path: 'regist', component: Regist}
];
