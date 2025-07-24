import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { ReactiveTableService } from 'src/app/shared/reactive-table.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TableModule } from 'src/app/pages/table/table.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Impuestos } from 'src/app/Modelos/ventas/Impuestos.Model';
import { EditComponent } from '../edit/edit.component';
import { FloatingMenuService } from 'src/app/shared/floating-menu.service';

 import { trigger,  state,  style,  transition,  animate} from '@angular/animations';
@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BreadcrumbsComponent,
    TableModule,
    PaginationModule,
    EditComponent,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],

animations: [
    trigger('fadeExpand', [
      transition(':enter', [
        style({
          height: '0',
          opacity: 0,
          transform: 'scaleY(0.90)',
          overflow: 'hidden'
        }),
        animate(
          '300ms ease-out',
          style({
            height: '*',
            opacity: 1,
            transform: 'scaleY(1)',
            overflow: 'hidden'
          })
        )
      ]),
      transition(':leave', [
        style({ overflow: 'hidden' }),
        animate(
          '300ms ease-in',
          style({
            height: '0',
            opacity: 0,
            transform: 'scaleY(0.95)'
          })
        )
      ])
    ])
  ]
})


export class ListComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  accionesDisponibles: string[] = [];

  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Ventas' },
      { label: 'Impuestos', active: true }
    ];
    this.cargarAccionesUsuario();
    console.log('Acciones disponibles:', this.accionesDisponibles);
  }

  onDocumentClick(event: MouseEvent, rowIndex: number) {
    const target = event.target as HTMLElement;
    const dropdowns = document.querySelectorAll('.dropdown-action-list');
    let clickedInside = false;
    dropdowns.forEach((dropdown, idx) => {
      if (dropdown.contains(target) && this.activeActionRow === rowIndex) {
        clickedInside = true;
      }
    });
    if (!clickedInside && this.activeActionRow === rowIndex) {
      this.activeActionRow = null;
    }
  }

  crear(): void {

    this.showEditForm = false;
    this.activeActionRow = null;
  }

  editar(impuesto: Impuestos ): void {
    this.impuestoEditando = { ...impuesto };
    this.showEditForm = true;

    this.activeActionRow = null;
  }


  activeActionRow: number | null = null;
  showEdit = true;
  showEditForm = false;
  showDetailsForm = false;
  impuestoEditando: Impuestos | null = null;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEliminar = false;
  impuestoAEliminar: Impuestos | null = null;
  mostrarOverlayCarga = false;

  constructor(
    public table: ReactiveTableService<Impuestos>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService
  ) {
    this.cargardatos(true);
  }

  onActionMenuClick(rowIndex: number) {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.impuestoEditando = null;
  }


  actualizarImpuesto(impuesto: Impuestos): void {
    console.log('Impuesto actualizado exitosamente desde edit component:', impuesto);
    this.cargardatos(false);
    this.cerrarFormularioEdicion();
  }



  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  private cargarAccionesUsuario(): void {
    const permisosRaw = localStorage.getItem('permisosJson');
    console.log('Valor bruto en localStorage (permisosJson):', permisosRaw);
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        let modulo = null;
        if (Array.isArray(permisos)) {
          modulo = permisos.find((m: any) => m.Pant_Id === 37); // Ajusta el ID
        } else if (typeof permisos === 'object' && permisos !== null) {
          modulo = permisos['Impuestos'] || permisos['impuestos'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          accionesArray = modulo.Acciones.map((a: any) => a.Accion).filter((a: any) => typeof a === 'string');
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLowerCase());
    console.log('Acciones finales:', this.accionesDisponibles);
  }

  private cargardatos(state: boolean): void {
      this.mostrarOverlayCarga = state;
    this.http.get<Impuestos[]>(`${environment.apiBaseUrl}/Impuestos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
     }).subscribe(data => {
        setTimeout(() => {
          this.mostrarOverlayCarga = false;
          this.table.setData(data);
        },500);
      });
  }
}
