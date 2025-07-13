import { Component, QueryList, ViewChildren } from '@angular/core';

// Data Get
import { gridlist } from './data';

import {GridJsModel} from './gridjs.model';
import { GridJsService } from './gridjs.service';
import { NgbdGridJsSortableHeader, SortEvent } from './gridjs-sortable.directive';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-gridjs',
  templateUrl: './gridjs.component.html',
  styleUrls: [
    './gridjs.component.scss',
    '../../../pages/ui/button/button.component.scss'
  ],
  providers: [GridJsService, DecimalPipe]
})
export class GridjsComponent {
  activeActionRow: number | null = null;
  menuPosition = { top: 0, left: 0, show: false };
  dropupRows: Set<number> = new Set();

 // bread crumb items
 breadCrumbItems!: Array<{}>;

 // Table data
 gridjsList$!: Observable<GridJsModel[]>;
 total$: Observable<number>;
 @ViewChildren(NgbdGridJsSortableHeader) headers!: QueryList<NgbdGridJsSortableHeader>;

 constructor(public service: GridJsService, private formBuilder: UntypedFormBuilder) {
  this.gridjsList$ = service.countries$;
  this.total$ = service.total$;
 }
  
  ngOnInit(): void {
   /**s
    * BreadCrumb
    */
   this.breadCrumbItems = [
    { label: 'Tables' },
    { label: 'Grid Js', active: true }
  ];
  }

  /**
  * Sort table data
  * @param param0 sort the column
  *
  */
  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  onActionMenuClick(button: HTMLButtonElement, rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
    if (this.activeActionRow === rowIndex) {
      setTimeout(() => {
        const rect = button.getBoundingClientRect();
        const menuHeight = 150;
        let top = rect.bottom + window.scrollY + 5; // 5px margin
        let left = rect.left + window.scrollX;
        // Si no cabe abajo, abre hacia arriba
        if (window.innerHeight - rect.bottom < menuHeight + 20) {
          top = rect.top + window.scrollY - menuHeight - 5;
        }
        this.menuPosition = { top, left, show: true };
      }, 10);
    }
  }
}
