import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { IndexComponent } from './index/index.component';
import { PermisosDebugComponent } from './permisos-debug/permisos-debug.component';
import { PermisosEjemploComponent } from './permisos-ejemplo/permisos-ejemplo.component';
// No importamos el PermisoGuard aquí para asegurar que estas rutas siempre sean accesibles

const routes: Routes = [
  {
    path: "",
    component: IndexComponent
  },
  {
    path: "permisos-debug",
    component: PermisosDebugComponent,
    // No hay guard de permisos aquí para asegurar acceso
    data: { pantallaId: -1 } // ID negativo para siempre ser accesible
  },
  {
    path: "permisos-ejemplo",
    component: PermisosEjemploComponent,
    // No hay guard de permisos aquí para asegurar acceso
    data: { pantallaId: -2 } // ID negativo para siempre ser accesible
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
