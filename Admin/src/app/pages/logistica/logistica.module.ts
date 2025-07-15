import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { LogisticaRoutingModule } from './logistica-routing.module'; // <-- corregido

@NgModule({
  imports: [
    CommonModule,
    LogisticaRoutingModule, 
    SharedModule
  ],
})
export class LogisticaModule { }
