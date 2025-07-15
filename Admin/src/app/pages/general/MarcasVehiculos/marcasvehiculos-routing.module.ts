import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarcasVehiculosRoutes } from './routes';

const routes: Routes = MarcasVehiculosRoutes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarcasVehiculosRoutingModule {}