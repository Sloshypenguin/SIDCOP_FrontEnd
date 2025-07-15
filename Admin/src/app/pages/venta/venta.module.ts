import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { VentaRoutingModule } from './venta-routing.module'; // <-- corregido

@NgModule({
  imports: [
    CommonModule,
    VentaRoutingModule, 
    SharedModule
  ],
})
export class VentaModule { }
