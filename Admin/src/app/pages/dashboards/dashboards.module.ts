import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing
import { DashboardsRoutingModule } from './dashboards-routing.module';

// Shared
import { SharedModule } from 'src/app/shared/shared.module';

// Components
import { IndexComponent } from './index/index.component';
import { LocalstorageDebugComponent } from './index/localstorage-debug.component';


// UI y librerías
import { SimplebarAngularModule } from 'simplebar-angular';
import { FlatpickrModule } from 'angularx-flatpickr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    DashboardsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    FlatpickrModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    // Importar componentes standalone
    LocalstorageDebugComponent
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardsModule { }
