import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// page routing
import { AuthRoutingModule } from './auth-routing.module';
import { ErrorsModule } from './errors/errors.module';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ErrorsModule
  ],
  exports: [

  ]

})
export class AuthModule { }
