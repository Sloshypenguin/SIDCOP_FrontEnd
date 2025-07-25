import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListasPreciosRoutes } from './routes';

const routes: Routes = ListasPreciosRoutes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListasPreciosRoutingModule {}

