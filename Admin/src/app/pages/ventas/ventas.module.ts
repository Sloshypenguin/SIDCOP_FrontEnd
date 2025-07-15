import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { VentasRoutingModule } from './configuracionFactura/ventas-routing.module'; // <-- corregido
  
@NgModule({
  imports: [
    CommonModule,
    VentasRoutingModule,
    SharedModule
  ],
})
export class VentasModule { }
