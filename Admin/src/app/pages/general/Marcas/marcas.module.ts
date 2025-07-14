import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarcasRoutingModule } from './marcas-routing.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Sucursales',
    },
    children: [
      { 
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => import('./list/list.component').then(m => m.ListComponent),
        data: {
          title: 'Listado de Sucursales',
        }
      },
    ]
  }
];



@NgModule({
  imports: [
    CommonModule,
    MarcasRoutingModule
  ]
})
export class Marcasmodule {}