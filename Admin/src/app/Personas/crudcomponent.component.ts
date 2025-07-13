import { Component, ViewChildren, QueryList } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';

import { GridJsService } from 'src/app/pages/table/gridjs/gridjs.service';
import { GridJsModel } from 'src/app/pages/table/gridjs/gridjs.model';
import { SortEvent } from 'src/app/pages/table/gridjs/gridjs-sortable.directive';

import { Observable } from 'rxjs';
import { TableModule } from '../pages/table/table.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbsComponent,
    TableModule,
    PaginationModule
  ],
  templateUrl: './crudcomponent.html',
  styleUrls: ['./crudcomponent.scss'],
  providers: [GridJsService, DecimalPipe]
})
export class CrudComponent {
  gridjsList$!: Observable<GridJsModel[]>;
  total$!: Observable<number>;
  @ViewChildren('sortableHeader') headers!: QueryList<any>; 

  constructor(public service: GridJsService) {
    this.gridjsList$ = service.countries$;
    this.total$ = service.total$;
  }

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}