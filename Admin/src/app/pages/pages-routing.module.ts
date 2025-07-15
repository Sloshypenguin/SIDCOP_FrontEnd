import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dashboards/dashboards.module').then((m) => m.DashboardsModule),
  },
  {
    path: 'apps',
    loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule),
  },
  {
    path: 'ui',
    loadChildren: () => import('./ui/ui.module').then((m) => m.UiModule),
  },
  {
    path: 'real-estate',
    loadChildren: () =>
      import('./real-estate/real-estate.module').then(
        (m) => m.RealEstateModule
      ),
  },
  {
    path: 'icons',
    loadChildren: () =>
      import('./icons/icons.module').then((m) => m.IconsModule),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./charts/charts.module').then((m) => m.ChartsModule),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('./table/table.module').then((m) => m.TableModule),
  },


  {
    path: 'pages',
    loadChildren: () =>
      import('./extrapages/extrapages.module').then((m) => m.ExtrapagesModule),
  },
  {
    path: 'general',
    loadChildren: () =>
      import('./general/general.module').then((m) => m.GeneralModule),
  },
  {
    path: 'logistica',
    loadChildren: () =>
      import('./logistica/logistica.module').then((m) => m.LogisticaModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
