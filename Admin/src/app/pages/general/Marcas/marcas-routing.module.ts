import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarcasRoutes } from './routes';

const routes: Routes = MarcasRoutes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarcasRoutingModule {}