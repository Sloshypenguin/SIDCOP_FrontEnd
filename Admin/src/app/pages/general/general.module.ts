import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { GeneralRoutingModule } from './general-routing.module'; // <-- corregido

@NgModule({
  imports: [
    CommonModule,
    GeneralRoutingModule, 
    SharedModule
  ],
})
export class GeneralModule { }
