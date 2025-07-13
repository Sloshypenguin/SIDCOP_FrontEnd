import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [
    // ...otros componentes si los hay...
  ],
  imports: [
    CommonModule,
    BreadcrumbsComponent
  ],
  exports: [
    BreadcrumbsComponent
    // ...otros componentes si los hay...
  ]
})
export class SharedModule { }
