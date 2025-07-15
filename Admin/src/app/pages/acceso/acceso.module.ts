import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { AccesoRoutingModule } from './acceso-routing.module'; // <-- corregido

@NgModule({
  imports: [
    CommonModule,
    AccesoRoutingModule, 
    SharedModule
  ],
})
export class AccesoModule { }
