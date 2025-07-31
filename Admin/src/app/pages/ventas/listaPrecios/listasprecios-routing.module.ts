import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermisoGuard } from '../../../core/guards/permiso.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Listas Precios',
    },
    children: [
      { 
        path: '',
        redirectTo: 'create',
        pathMatch: 'full'
      },
      {
        path: 'create',
        loadComponent: () => import('./create/create.component').then(m => m.CreateComponent),
        data: {
          title: 'Listas de Precios',
          pantallaId: 59  // ID 7: Usuarios según la tabla de pantallas
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListasPreciosRoutingModule {}