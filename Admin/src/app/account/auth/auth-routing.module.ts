import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// component
import { SigninComponent } from './signin/signin.component';

import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { LogoutComponent } from './logout/logout.component';


const routes: Routes = [
  {
    path: 'signin',
    component: SigninComponent,
  },
  
  {
    path: 'lockscreen',
    component: LockscreenComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },

  {
    path: 'errors', loadChildren: () => import('./errors/errors.module').then(m => m.ErrorsModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
