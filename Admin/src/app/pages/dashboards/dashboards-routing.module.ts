import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { AnalyticsComponent } from './analytics/analytics.component';

import { IndexComponent } from './index/index.component';



const routes: Routes = [
  {
    path: "",
    component: IndexComponent
  },
  {
    path: "analytics",
    component: AnalyticsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
