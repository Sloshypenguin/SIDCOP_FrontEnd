import { Component, OnInit } from '@angular/core';
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
import { RegistroCAI } from 'src/app/Modelos/ventas/RegistroCAI.Model';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { FloatingMenuService } from 'src/app/shared/floating-menu.service';
// Importar el servicio de exportación optimizado
import { ExportService, ExportConfig, ExportColumn } from 'src/app/shared/export.service';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { set } from 'lodash';

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
    CreateComponent,
    EditComponent,
    DetailsComponent,
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
          overflow: 'hidden',
        }),
        animate(
          '300ms ease-out',
          style({
            height: '*',
            opacity: 1,
            transform: 'scaleY(1)',
            overflow: 'hidden',
          })
        ),
      ]),
      transition(':leave', [
        style({ overflow: 'hidden' }),
        animate(
          '300ms ease-in',
          style({
            height: '0',
            opacity: 0,
            transform: 'scaleY(0.95)',
          })
        ),
      ]),
    ]),
  ],
  //Animaciones para collapse
})
export class ListComponent implements OnInit {
  private readonly exportConfig = {
      // Configuración básica
      title: 'Listado de Puntos de Emision',                    // Título del reporte
      filename: 'Puntos de Emisión',                           // Nombre base del archivo
      department: 'Ventas',                         // Departamento
      additionalInfo: 'Sistema de Gestión',         // Información adicional
      
      // Columnas a exportar - CONFIGURA SEGÚN TUS DATOS
      columns: [
        { key: 'No', header: 'No.', width: 8, align: 'center' as const },
        { key: 'Codigo', header: 'Codigo', width: 25, align: 'left' as const },
        { key: 'Descripción', header: 'Descripción', width: 50, align: 'left' as const },
          { key: 'Sucursal', header: 'Sucursal', width: 75, align: 'left' as const }
      ] as ExportColumn[],
      
      // Mapeo de datos - PERSONALIZA SEGÚN TU MODELO
      dataMapping: (modelo: RegistroCAI, index: number) => ({
        'No': modelo?.secuencia || (index + 1),
        'Codigo': this.limpiarTexto(modelo?.puEm_Codigo),
        'Descripción': this.limpiarTexto(modelo?.puEm_Descripcion),
         'Sucursal': this.limpiarTexto(modelo?.sucu_Descripcion)
        // Agregar más campos aquí según necesites:
        // 'Campo': this.limpiarTexto(modelo?.campo),
      })
    };

     exportando = false;
  tipoExportacion: 'excel' | 'pdf' | 'csv' | null = null;
  


  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Acciones disponibles para el usuario en esta pantalla
  accionesDisponibles: string[] = [];

  // Método robusto para validar si una acción está permitida
  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(
      (a) => a.trim().toLowerCase() === accion.trim().toLowerCase()
    );
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Ventas' },
      { label: 'Registro CAI', active: true },
    ];

    this.cargarAccionesUsuario();
  }

  // Métodos para los botones de acción principales (crear, editar, detalles)
  crear(): void {
    console.log('Toggleando formulario de creación...');
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false; // Cerrar edit si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  editar(registroCai: RegistroCAI): void {
    console.log('Abriendo formulario de edición para:', registroCai);
    console.log('Datos específicos:', {
      id: registroCai.regC_Id,
      descripcion: registroCai.regC_Descripcion,
      completo: registroCai,
    });
    this.RegistroCAIEditando = { ...registroCai }; // Hacer copia profunda
    this.showEditForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showDetailsForm = false; // Cerrar details si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  detalles(registroCai: RegistroCAI): void {
    console.log('Abriendo detalles para:', registroCai);
    this.RegistroCAIDetalle = { ...registroCai }; // Hacer copia profunda
    this.showDetailsForm = true;
    this.showCreateForm = false; // Cerrar create si está abierto
    this.showEditForm = false; // Cerrar edit si está abierto
    this.activeActionRow = null; // Cerrar menú de acciones
  }
  activeActionRow: number | null = null;
  showEdit = true;
  showDetails = true;
  showDelete = true;
  showCreateForm = false; // Control del collapse
  showEditForm = false; // Control del collapse de edición
  showDetailsForm = false; // Control del collapse de detalles
  RegistroCAIEditando: RegistroCAI | null = null;
  RegistroCAIDetalle: RegistroCAI | null = null;

  // Propiedades para alertas
  mostrarOverlayCarga = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  // Propiedades para confirmación de eliminación
  mostrarConfirmacionEliminar = false;
  RegistroCAIAEliminar: RegistroCAI | null = null;

  constructor(
    public table: ReactiveTableService<RegistroCAI>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService,
     private exportService: ExportService
  ) {
    this.cargardatos(true);
  }

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
        department: this.exportConfig.department,
        additionalInfo: this.exportConfig.additionalInfo
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

  // (navigateToCreate eliminado, lógica movida a crear)

  // (navigateToEdit y navigateToDetails eliminados, lógica movida a editar y detalles)

  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.RegistroCAIEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.RegistroCAIDetalle = null;
  }

  guardarRegistroCAI(registroCai: RegistroCAI): void {
    this.mostrarOverlayCarga = true;
    setTimeout(() => {
      this.cargardatos(false);
      this.showCreateForm = false;
      this.mensajeExito = `Punto de Emision guardado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  actualizarRegistroCAI(registroCai: RegistroCAI): void {
    this.mostrarOverlayCarga = true;
    setTimeout(() => {
      this.cargardatos(false);
      this.showEditForm = false;
      this.mensajeExito = `Punto de Emision actualizado exitosamente`;
      this.mostrarAlertaExito = true;
      setTimeout(() => {
        this.mostrarAlertaExito = false;
        this.mensajeExito = '';
      }, 3000);
    }, 1000);
  }

  confirmarEliminar(registroCai: RegistroCAI): void {
    console.log('Solicitando confirmación para eliminar:', registroCai);
    this.RegistroCAIAEliminar = registroCai;
    this.mostrarConfirmacionEliminar = true;
    this.activeActionRow = null; // Cerrar menú de acciones
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.RegistroCAIAEliminar = null;
  }

  eliminar(): void {
    if (!this.RegistroCAIAEliminar) return;

    console.log('Eliminando estado civil:', this.RegistroCAIAEliminar);
    this.mostrarOverlayCarga = true;
    this.http
      .post(
        `${environment.apiBaseUrl}/EstadosCiviles/Eliminar/${this.RegistroCAIAEliminar.regC_Id}`,
        {},
        {
          headers: {
            'X-Api-Key': environment.apiKey,
            accept: '*/*',
          },
        }
      )
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta del servidor:', response);

          // Verificar el código de estado en la respuesta
          if (response.success && response.data) {
            if (response.data.code_Status === 1) {
              // Éxito: eliminado correctamente
              console.log('Registro CAI eliminado exitosamente');
              this.mensajeExito = `Registro CAI "${
                this.RegistroCAIAEliminar!.regC_Descripcion
              }" eliminado exitosamente`;
              this.mostrarAlertaExito = true;

              // Ocultar la alerta después de 3 segundos
              setTimeout(() => {
                this.mostrarAlertaExito = false;
                this.mensajeExito = '';
              }, 3000);

               this.cargardatos(false);
              this.cancelarEliminar();
            } else if (response.data.code_Status === -1) {
              //result: está siendo utilizado
              console.log('El Registro CAI está siendo utilizado');
              this.mostrarAlertaError = true;
              this.mensajeError =
                response.data.message_Status ||
                'No se puede eliminar: el registro CAI está siendo utilizado.';

              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);

              // Cerrar el modal de confirmación
              this.cancelarEliminar();
            } else if (response.data.code_Status === 0) {
              // Error general
              console.log('Error general al eliminar');
              this.mostrarAlertaError = true;
              this.mensajeError =
                response.data.message_Status ||
                'Error al eliminar el registro CAI.';

              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
              }, 5000);

              // Cerrar el modal de confirmación
              this.cancelarEliminar();
            }
          } else {
            // Respuesta inesperada
            console.log('Respuesta inesperada del servidor');
            this.mostrarAlertaError = true;
            this.mensajeError =
              response.message ||
              'Error inesperado al eliminar el estado civil.';

            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);

            // Cerrar el modal de confirmación
            this.cancelarEliminar();
          }
        },
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

  private cargarAccionesUsuario(): void {
    // Obtener permisosJson del localStorage
    const permisosRaw = localStorage.getItem('permisosJson');
    console.log('Valor bruto en localStorage (permisosJson):', permisosRaw);
    let accionesArray: string[] = [];
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        // Buscar el módulo de Estados Civiles (ajusta el nombre si es diferente)
        let modulo = null;
        if (Array.isArray(permisos)) {
          // Buscar por ID de pantalla (ajusta el ID si cambia en el futuro)
          modulo = permisos.find((m: any) => m.Pant_Id === 14);
        } else if (typeof permisos === 'object' && permisos !== null) {
          // Si es objeto, buscar por clave
          modulo =
            permisos['Estados Civiles'] || permisos['estados civiles'] || null;
        }
        if (modulo && modulo.Acciones && Array.isArray(modulo.Acciones)) {
          // Extraer solo el nombre de la acción
          accionesArray = modulo.Acciones.map((a: any) => a.Accion).filter(
            (a: any) => typeof a === 'string'
          );
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    this.accionesDisponibles = accionesArray
      .filter((a) => typeof a === 'string' && a.length > 0)
      .map((a) => a.trim().toLowerCase());
    console.log('Acciones finales:', this.accionesDisponibles);
  }

 
   

    private cargardatos(state: boolean): void {
    this.mostrarOverlayCarga = state;

    this.http.get<RegistroCAI[]>(`${environment.apiBaseUrl}/RegistrosCaiS/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      const tienePermisoListar = this.accionPermitida('listar');
      const userId = getUserId();

      const datosFiltrados = tienePermisoListar
        ? data
        : data.filter(r => r.usua_Creacion?.toString() === userId.toString());

      setTimeout(() => {
        this.table.setData(datosFiltrados);
        this.mostrarOverlayCarga = false;
      }, 500);
    });
  }
}
