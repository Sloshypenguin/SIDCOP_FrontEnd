import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 
    {
    path: 'impuestos',
    loadChildren: () =>
      import('./impuestos/impuestos.module').then(m => m.ImpuestosModule)
  },
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImpuestosRoutingModule {}
