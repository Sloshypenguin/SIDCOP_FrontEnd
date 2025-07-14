import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MunicipiosRoutes } from './routes';

const routes: Routes = MunicipiosRoutes;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MunicipiosRoutingModule {}