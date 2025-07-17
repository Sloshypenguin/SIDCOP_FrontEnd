import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// page routing
import { AuthRoutingModule } from './auth-routing.module';
import { ErrorsModule } from './errors/errors.module';



// Component
import { SigninComponent } from './signin/signin.component';

import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [
    SigninComponent,
    LockscreenComponent,
    LogoutComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ErrorsModule
  ],
  exports: [
    SigninComponent,
    LockscreenComponent,
    LogoutComponent
  ]

})
export class AuthModule { }
