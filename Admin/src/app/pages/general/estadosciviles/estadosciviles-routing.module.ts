import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadosCivilesRoutes } from './routes';

const routes: Routes = EstadosCivilesRoutes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadosCivilesRoutingModule {}