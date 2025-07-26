import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Cuentas por Cobrar',
    },
    children: [
      { 
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadComponent: () => import('./list/list.component').then(m => m.ListComponent),
        data: {
          title: 'Listado de Cuentas por Cobrar',
        }
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent),
        data: {
          title: 'Detalles de Cuenta por Cobrar',
        }
      },
      {
        path: 'payment/:id',
        loadComponent: () => import('./payment/payment.component').then(m => m.PaymentComponent),
        data: {
          title: 'Registrar Pago',
        }
      },
    ]
  }
]; 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentasPorCobrarRoutingModule {}
