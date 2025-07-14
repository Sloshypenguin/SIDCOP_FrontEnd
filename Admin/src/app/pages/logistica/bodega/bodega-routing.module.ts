import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodegasRoutes } from './routes';

const routes: Routes = BodegasRoutes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BodegasRoutingModule {}