import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 
    {
    path: 'registroscais',
    loadChildren: () =>
      import('./registroscais/registroscais.module').then(m => m.RegistroCAIModule)
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasRoutingModule {}
