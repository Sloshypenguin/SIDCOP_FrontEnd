import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { GeneralRoutingModule } from './inventario-routing.module'; // <-- corregido

@NgModule({
  imports: [
    CommonModule,
    GeneralRoutingModule, 
    SharedModule
  ],
})
export class InventarioModule { }
