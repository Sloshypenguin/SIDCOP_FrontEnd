import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component

import { IndexComponent } from './index/index.component';



const routes: Routes = [
  {
    path: "",
    component: IndexComponent
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
