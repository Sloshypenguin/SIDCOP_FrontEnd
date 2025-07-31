import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { IndexComponent } from './index/index.component';

// No importamos el PermisoGuard aquí para asegurar que estas rutas siempre sean accesibles

const routes: Routes = [
  {
    path: "",
    component: IndexComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
