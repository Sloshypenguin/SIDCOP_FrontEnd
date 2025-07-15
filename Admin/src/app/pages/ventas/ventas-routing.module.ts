import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 
    {
    path: 'registroscais',
    loadChildren: () =>
      import('./registroscais/registroscais.module').then(m => m.RegistroCAIModule)
  },
    {
    path: 'puntosemision',
    loadChildren: () =>
      import('./puntosemision/puntosemision.module').then(m => m.PuntoEmisionModule)
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VentasRoutingModule {}
