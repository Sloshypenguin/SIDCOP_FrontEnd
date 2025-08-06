import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { ReactiveTableService } from 'src/app/shared/reactive-table.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
import { TableModule } from 'src/app/pages/table/table.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Canal } from 'src/app/Modelos/general/Canal.Model';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { FloatingMenuService } from 'src/app/shared/floating-menu.service';
import { ExportService, ExportConfig, ExportColumn } from 'src/app/shared/export.service';

@Component({
  selector: 'app-list-canales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BreadcrumbsComponent,
    TableModule,
    PaginationModule,
    CreateComponent,
    EditComponent,
    DetailsComponent
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
  private readonly exportConfig = {
        // Configuración básica
        title: 'Listado de Estados Civiles',                    // Título del reporte
        filename: 'Estados Civiles',                           // Nombre base del archivo
  
        // Columnas a exportar - CONFIGURA SEGÚN TUS DATOS
        columns: [
          { key: 'No', header: 'No.', width: 8, align: 'center' as const },
          { key: 'Descripción', header: 'Descripción', width: 25, align: 'left' as const },
          { key: 'Observaciones', header: 'Observaciones', width: 25, align: 'left' as const }
        ] as ExportColumn[],
        
        // Mapeo de datos - PERSONALIZA SEGÚN TU MODELO
        dataMapping: (modelo: Canal, index: number) => ({
          'No': modelo?.secuencia || (index + 1),
          'Descripción': this.limpiarTexto(modelo?.cana_Descripcion),
          'Observaciones': this.limpiarTexto(modelo?.cana_Observaciones)
          
          // Agregar más campos aquí según necesites:
          // 'Campo': this.limpiarTexto(modelo?.campo),
        })
      };
  // Overlay de carga animado
  mostrarOverlayCarga = false;
  breadCrumbItems!: Array<{}>;


  accionesDisponibles: string[] = [];

  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Canales', active: true }
    ];
    this.cargarAccionesUsuario();
    this.cargardatos(true);
  }
// ===== MÉTODOS DE EXPORTACIÓN OPTIMIZADOS =====

  /**
   * Método unificado para todas las exportaciones
   */
  async exportar(tipo: 'excel' | 'pdf' | 'csv'): Promise<void> {
    if (this.exportando) {
      this.mostrarMensaje('warning', 'Ya hay una exportación en progreso...');
      return;
    }

    if (!this.validarDatosParaExport()) {
      return;
    }

    try {
      this.exportando = true;
      this.tipoExportacion = tipo;
      this.mostrarMensaje('info', `Generando archivo ${tipo.toUpperCase()}...`);
      
      const config = this.crearConfiguracionExport();
      let resultado;
      
      switch (tipo) {
        case 'excel':
          resultado = await this.exportService.exportToExcel(config);
          break;
        case 'pdf':
          resultado = await this.exportService.exportToPDF(config);
          break;
        case 'csv':
          resultado = await this.exportService.exportToCSV(config);
          break;
      }
      
      this.manejarResultadoExport(resultado);
      
    } catch (error) {
      console.error(`Error en exportación ${tipo}:`, error);
      this.mostrarMensaje('error', `Error al exportar archivo ${tipo.toUpperCase()}`);
    } finally {
      this.exportando = false;
      this.tipoExportacion = null;
    }
  }

  /**
   * Métodos específicos para cada tipo (para usar en templates)
   */
  async exportarExcel(): Promise<void> {
    await this.exportar('excel');
  }

  async exportarPDF(): Promise<void> {
    await this.exportar('pdf');
  }

  async exportarCSV(): Promise<void> {
    await this.exportar('csv');
  }

  /**
   * Verifica si se puede exportar un tipo específico
   */
  puedeExportar(tipo?: 'excel' | 'pdf' | 'csv'): boolean {
    if (this.exportando) {
      return tipo ? this.tipoExportacion !== tipo : false;
    }
    return this.table.data$.value?.length > 0;
  }

  // ===== MÉTODOS PRIVADOS DE EXPORTACIÓN =====

  /**
   * Crea la configuración de exportación de forma dinámica
   */
  private crearConfiguracionExport(): ExportConfig {
    return {
      title: this.exportConfig.title,
      filename: this.exportConfig.filename,
      data: this.obtenerDatosExport(),
      columns: this.exportConfig.columns,
      metadata: {
      }
    };
  }

  /**
   * Obtiene y prepara los datos para exportación
   */
  private obtenerDatosExport(): any[] {
    try {
      const datos = this.table.data$.value;
      
      if (!Array.isArray(datos) || datos.length === 0) {
        throw new Error('No hay datos disponibles para exportar');
      }
      
      // Usar el mapeo configurado
      return datos.map((modelo, index) => 
        this.exportConfig.dataMapping.call(this, modelo, index)
      );
      
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error;
    }
  }


  /**
   * Maneja el resultado de las exportaciones
   */
  private manejarResultadoExport(resultado: { success: boolean; message: string }): void {
    if (resultado.success) {
      this.mostrarMensaje('success', resultado.message);
    } else {
      this.mostrarMensaje('error', resultado.message);
    }
  }

  /**
   * Valida datos antes de exportar
   */
  private validarDatosParaExport(): boolean {
    const datos = this.table.data$.value;
    
    if (!Array.isArray(datos) || datos.length === 0) {
      this.mostrarMensaje('warning', 'No hay datos disponibles para exportar');
      return false;
    }
    
    if (datos.length > 10000) {
      const continuar = confirm(
        `Hay ${datos.length.toLocaleString()} registros. ` +
        'La exportación puede tomar varios minutos. ¿Desea continuar?'
      );
      if (!continuar) return false;
    }
    
    return true;
  }

  /**
   * Limpia texto para exportación de manera más eficiente
   */
  private limpiarTexto(texto: any): string {
    if (!texto) return '';
    
    return String(texto)
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-.,;:()\[\]]/g, '')
      .trim()
      .substring(0, 150);
  }

  /**
   * Sistema de mensajes mejorado con tipos adicionales
   */
  private mostrarMensaje(tipo: 'success' | 'error' | 'warning' | 'info', mensaje: string): void {
    this.cerrarAlerta();
    
    const duracion = tipo === 'error' ? 5000 : 3000;
    
    switch (tipo) {
      case 'success':
        this.mostrarAlertaExito = true;
        this.mensajeExito = mensaje;
        setTimeout(() => this.mostrarAlertaExito = false, duracion);
        break;
        
      case 'error':
        this.mostrarAlertaError = true;
        this.mensajeError = mensaje;
        setTimeout(() => this.mostrarAlertaError = false, duracion);
        break;
        
      case 'warning':
      case 'info':
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = mensaje;
        setTimeout(() => this.mostrarAlertaWarning = false, duracion);
        break;
    }
  }
  // Form controls
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;
  canalEditando: Canal | null = null;
  canalDetalle: Canal | null = null;

  // Alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  // Confirmación eliminar
  mostrarConfirmacionEliminar = false;
  canalAEliminar: Canal | null = null;
  exportando = false;
  tipoExportacion: 'excel' | 'pdf' | 'csv' | null = null;
  constructor(
    public table: ReactiveTableService<Canal>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService,
    private exportService: ExportService
  ) {}

  // Overlay de carga controlado por hijos
  onOverlayChange(visible: boolean) {
    this.mostrarOverlayCarga = visible;
  }

  crear(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
    // (Eliminada referencia a activeActionRow)
  }

  editar(canal: Canal): void {
    this.canalEditando = { ...canal };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
  }

  detalles(canal: Canal): void {
    this.canalDetalle = { ...canal };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;

  }

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.canalEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.canalDetalle = null;
  }

  guardarCanal(canal: Canal): void {
    this.cargardatos(false);
    this.cerrarFormulario();
    // El overlay se oculta en cargardatos, no aquí
    setTimeout(() => this.mostrarAlertaExito = false, 3000);
  }

  actualizarCanal(canal: Canal): void {
    this.cargardatos(false);
    this.cerrarFormularioEdicion();
    // El overlay se oculta en cargardatos, no aquí
    setTimeout(() => this.mostrarAlertaExito = false, 3000);
  }

  confirmarEliminar(canal: Canal): void {
    this.canalAEliminar = canal;
    this.mostrarConfirmacionEliminar = true;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.canalAEliminar = null;
  }

  eliminar(): void {
    if (!this.canalAEliminar) return;
    this.http.put(`${environment.apiBaseUrl}/Canal/Eliminar/${this.canalAEliminar.cana_Id}`, {}, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          if (response.data.code_Status === 1) {
            this.mensajeExito = `Canal "${this.canalAEliminar!.cana_Descripcion}" eliminado exitosamente`;
            this.mostrarAlertaExito = true;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.mensajeExito = '';
            }, 3000);
            this.cargardatos(false);
            this.cancelarEliminar();
          } else if (response.data.code_Status === -1) {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'No se puede eliminar: el canal está siendo utilizado.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            this.cancelarEliminar();
          } else if (response.data.code_Status === 0) {
            this.mostrarAlertaError = true;
            this.mensajeError = response.data.message_Status || 'Error al eliminar el canal.';
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
            this.cancelarEliminar();
          }
        } else {
          this.mostrarAlertaError = true;
          this.mensajeError = response.message || 'Error inesperado al eliminar el canal.';
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          this.cancelarEliminar();
        }
      }
    });
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }
  
private cargardatos(state: boolean): void {
    this.mostrarOverlayCarga = state;
    this.http.get<Canal[]>(`${environment.apiBaseUrl}/Canal/Listar`, {
        headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
        setTimeout(() => {
            const tienePermisoListar = this.accionPermitida('listar');
            const userId = getUserId();

            const datosFiltrados = tienePermisoListar
                ? data
                : data.filter(r => r.usua_Creacion?.toString() === userId.toString());

            this.table.setData(datosFiltrados);
            this.table.setData(data);
            this.mostrarOverlayCarga = false;
        }, 500);
    });
}

  // Método para cargar las acciones disponibles del usuario
  private cargarAccionesUsuario(): void {
    const permisosRaw = localStorage.getItem('permisosJson');
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        let modulo = null;
        if (Array.isArray(permisos)) {
          // Ajusta el ID si cambia en el futuro
          modulo = permisos.find((m: any) => m.Pant_Id === 11);
        } else if (typeof permisos === 'object' && permisos !== null) {
          modulo = permisos['Canales'] || permisos['canales'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          accionesArray = modulo.Acciones.map((a: any) => a.Accion).filter((a: any) => typeof a === 'string');
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    this.accionesDisponibles = accionesArray.filter(a => typeof a === 'string' && a.length > 0).map(a => a.trim().toLowerCase());
  }
}

