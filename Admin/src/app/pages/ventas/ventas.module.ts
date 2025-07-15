import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { ImpuestosRoutingModule } from './ventas-routing.module'; // <-- corregido
  
@NgModule({
  imports: [
    CommonModule,
    ImpuestosRoutingModule,
    SharedModule
  ],
})
export class VentasModule { }
