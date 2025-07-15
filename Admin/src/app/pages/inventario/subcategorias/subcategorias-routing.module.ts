import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubcategoriasRoutes } from './routes';

const routes: Routes = SubcategoriasRoutes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubcategoriasRoutingModule {}

