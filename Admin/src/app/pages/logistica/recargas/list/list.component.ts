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
import { Recargas } from 'src/app/Modelos/logistica/Recargas.Model';
import { FloatingMenuService } from 'src/app/shared/floating-menu.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ExportService, ExportConfig, ExportColumn } from 'src/app/shared/export.service';

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

  // =========================================
  // CONFIGURACIÓN DE EXPORTACIÓN
  // =========================================
  private readonly exportConfig = {
    title: 'Listado de Recargas',
    filename: 'Recargas',
    department: 'Logistica',
    additionalInfo: 'Sistema de Gestión de Ventas',
    
    columns: [
      { key: 'No', header: 'No.', width: 10, align: 'center' as const },
      { key: 'Bodega', header: 'Bodega', width: 60, align: 'left' as const },
      { key: 'Recarga Confirmación', header: 'Recarga Confirmación', width: 25, align: 'left' as const },
      { key: 'Fecha Recarga', header: 'Fecha Recarga', width: 20, align: 'left' as const },
      { key: 'Detalles', header: 'Detalles', width: 35, align: 'left' as const }
    ] as ExportColumn[],
    
    // Mapeo de datos para exportación
    dataMapping: (recargas: Recargas, index: number) => ({
      'No': recargas?.secuencia || (index + 1),
      'Bodega': this.limpiarTexto(recargas?.bode_Descripcion),
      'Recarga Confirmación': this.limpiarTexto(recargas?.reca_Confirmacion),
      'Fecha Recarga': this.limpiarTexto(recargas?.Reca_Fecha),
      'Detalles': this.limpiarTexto(recargas?.detalles),
    })
  };

  // =========================================
  // PROPIEDADES DE COMPONENTE
  // =========================================
  
  // Navegación y breadcrumbs
  breadCrumbItems!: Array<{}>;
  
  // Control de permisos y usuario
  accionesDisponibles: string[] = [];
  currentUser: any = null;
  EsAdmin : boolean = false;
  
  // Control de menú de acciones
  activeActionRow: number | null = null;

  // Control de formularios
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;

  // Sistema de alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  // Estado de carga y exportación
  mostrarOverlayCarga = false;
  tieneRegistros = false;
  exportando = false;
  tipoExportacion: 'excel' | 'pdf' | 'csv' | null = null;

  // =========================================
  // CONSTRUCTOR E INICIALIZACIÓN
  // =========================================
  constructor(
    public table: ReactiveTableService<Recargas>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService,
    private exportService: ExportService
  ) {
    // No cargar datos aquí, se hará después de cargar los datos de sesión
  }

  ngOnInit(): void {
    // Configurar breadcrumbs
    this.breadCrumbItems = [
      { label: 'Logistica' },
      { label: 'Recargas', active: true }
    ];
    
    // Inicializar datos del usuario y permisos
    this.cargarDatosSesion();
    this.cargarAccionesUsuario();
    
    // Cargar datos después de tener la información de sesión
    setTimeout(() => {
      this.cargardatos(true);
    }, 0);
  }

  // =========================================
  // MÉTODOS DE GESTIÓN DE USUARIO Y SESIÓN
  // =========================================
  
  /**
   * Carga los datos del usuario actual desde localStorage
   */
  cargarDatosSesion(): void {
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      try {
        this.currentUser = JSON.parse(currentUserStr);
        // Corregido: usar usua_EsAdmin en lugar de esAdmin
        this.EsAdmin = this.currentUser.usua_EsAdmin || false; 
        console.log('Usuario cargado:', {
          id: this.currentUser.usua_Id,
          nombre: this.currentUser.usua_Usuario,
          sucursal: this.currentUser.sucu_Id,
          esAdmin: this.EsAdmin
        });
      } catch (e) {
        console.error('Error al parsear datos del usuario:', e);
        this.currentUser = null;
        this.EsAdmin = false;
      }
    }
  }

 
    //Carga las acciones/permisos disponibles del usuario para este módulo
 
  private cargarAccionesUsuario(): void {
    const permisosRaw = localStorage.getItem('permisosJson');
    let accionesArray: string[] = [];
    
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        let modulo = null;
        
        // Buscar el módulo de recargas en los permisos
        if (Array.isArray(permisos)) {
          modulo = permisos.find((m: any) => m.Pant_Id === 33);
        } else if (typeof permisos === 'object' && permisos !== null) {
          modulo = permisos['Recargas'] || permisos['recargas'] || null;
        }
        
        // Extraer acciones del módulo
        if (modulo?.Acciones && Array.isArray(modulo.Acciones)) {
          accionesArray = modulo.Acciones
            .map((a: any) => a.Accion)
            .filter((a: any) => typeof a === 'string');
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    
    // Normalizar acciones a minúsculas para comparación
    this.accionesDisponibles = accionesArray
      .filter(a => typeof a === 'string' && a.length > 0)
      .map(a => a.trim().toLowerCase());
  }

  /**
   * Valida si una acción específica está permitida para el usuario
   */
  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a === accion.trim().toLowerCase());
  }

  // =========================================
  // MÉTODOS DE EXPORTACIÓN
  // =========================================
  
  /**
   * Método unificado para todas las exportaciones
   */
  async exportar(tipo: 'excel' | 'pdf' | 'csv'): Promise<void> {
    // Validar si ya hay una exportación en progreso
    if (this.exportando) {
      this.mostrarMensaje('warning', 'Ya hay una exportación en progreso...');
      return;
    }

    // Validar datos antes de exportar
    if (!this.validarDatosParaExport()) {
      return;
    }

    try {
      this.exportando = true;
      this.tipoExportacion = tipo;
      this.mostrarMensaje('info', `Generando archivo ${tipo.toUpperCase()}...`);
      
      const config = this.crearConfiguracionExport();
      let resultado;
      
      // Ejecutar exportación según el tipo
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

  // Métodos específicos para cada tipo de exportación
  async exportarExcel(): Promise<void> { await this.exportar('excel'); }
  async exportarPDF(): Promise<void> { await this.exportar('pdf'); }
  async exportarCSV(): Promise<void> { await this.exportar('csv'); }

  /**
   * Verifica si se puede exportar (hay datos y no está exportando)
   */
  puedeExportar(tipo?: 'excel' | 'pdf' | 'csv'): boolean {
    if (this.exportando) {
      return tipo ? this.tipoExportacion !== tipo : false;
    }
    return this.table.data$.value?.length > 0;
  }

  // =========================================
  // MÉTODOS PRIVADOS DE EXPORTACIÓN
  // =========================================
  
  /**
   * Crea la configuración de exportación
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
      
      return datos.map((recargas, index) => 
        this.exportConfig.dataMapping.call(this, recargas, index)
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
    
    // Confirmación para grandes volúmenes de datos
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
   * Limpia texto para exportación
   */
  private limpiarTexto(texto: any): string {
    if (!texto) return '';
    
    return String(texto)
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-.,;:()\[\]]/g, '')
      .trim()
      .substring(0, 150);
  }

  // =========================================
  // MÉTODOS CRUD Y FORMULARIOS
  // =========================================
  
  /**
   * Abre el formulario de creación
   */
  crear(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  /**
   * Abre el formulario de edición para una recarga específica
   */
  editar(recargas: Recargas): void {
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
    this.activeActionRow = null;
  }

  /**
   * Abre el formulario de detalles para una recarga específica
   */
  detalles(recargas: Recargas): void {
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
    this.activeActionRow = null;
  }

  // Métodos para cerrar formularios
  cerrarFormulario(): void { this.showCreateForm = false; }
  cerrarFormularioEdicion(): void { this.showEditForm = false; }
  cerrarFormularioDetalles(): void { this.showDetailsForm = false; }

  // Métodos de respuesta de componentes hijos
  guardarConfiguracioFactura(recargas: Recargas): void {
    this.cargardatos(false);
    this.cerrarFormulario();
    this.mostrarMensaje('success', 'Recarga guardada exitosamente');
  }

  actualizarConfiguracioFactura(recargas: Recargas): void {
    this.cargardatos(false);
    this.cerrarFormularioEdicion();
    this.mostrarMensaje('success', 'Recarga actualizada exitosamente');
  }

  // =========================================
  // CONTROL DE MENÚ DE ACCIONES
  // =========================================
  

    //Controla la apertura/cierre del menú de acciones por fila
 
  onActionMenuClick(rowIndex: number): void {
    this.activeActionRow = this.activeActionRow === rowIndex ? null : rowIndex;
  }

  
    //Cierra el menú de acciones al hacer click fuera
  
  onDocumentClick(event: MouseEvent, rowIndex: number): void {
    const target = event.target as HTMLElement;
    const dropdowns = document.querySelectorAll('.dropdown-action-list');
    let clickedInside = false;
    
    dropdowns.forEach((dropdown) => {
      if (dropdown.contains(target) && this.activeActionRow === rowIndex) {
        clickedInside = true;
      }
    });
    
    if (!clickedInside && this.activeActionRow === rowIndex) {
      this.activeActionRow = null;
    }
  }

  // =========================================
  // SISTEMA DE MENSAJES Y ALERTAS
  // =========================================
  
  
    //Muestra mensajes de diferentes tipos (success, error, warning, info)
   
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
   * Cierra todas las alertas activas
   */
  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  // =========================================
  // CARGA DE DATOS DESDE API
  // =========================================
  
  /**
   * Carga los datos de recargas desde la API
   * @param state - Indica si mostrar overlay de carga
   */
  private cargardatos(state: boolean): void {
    this.mostrarOverlayCarga = state;

    // Verificar que tenemos datos de usuario cargados
    if (!this.currentUser) {
      console.error('Error: No hay datos de usuario disponibles');
      this.mostrarMensaje('error', 'Error al cargar datos de usuario');
      this.mostrarOverlayCarga = false;
      return;
    }

    // Usar los datos del usuario actual
    const sucuId = this.currentUser.sucu_Id || 0; // ID de sucursal del usuario
    const esAdmin = this.currentUser.usua_EsAdmin || false; // Si es administrador
    console.log(`Cargando datos para Sucursal ID: ${sucuId}, Es Admin: ${esAdmin}`);

    this.http.get<Recargas[]>(`${environment.apiBaseUrl}/Recargas/ListarsPorSucursal/${sucuId}/${esAdmin}`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      
      next: (data) => {
        console.log("date" + sucuId + esAdmin + data);
        // Filtrar datos según permisos del usuario
        const tienePermisoListar = this.accionPermitida('listar');
        const userId = getUserId();

        const datosFiltrados = tienePermisoListar
          ? data // Si tiene permiso de listar, mostrar todos los datos
          : data.filter(r => r.usua_Creacion?.toString() === userId.toString()); // Solo sus propios registros

        // Agregar numeración secuencial para la tabla
        datosFiltrados.forEach((recargas, index) => {
          recargas.secuencia = index + 1;
        });

        // Actualizar tabla y estado
        this.table.setData(datosFiltrados);
        this.tieneRegistros = datosFiltrados.length > 0;
      },
      error: (error) => {
        console.error('Error al cargar los datos:', error);
        this.mostrarOverlayCarga = false;
        this.mostrarMensaje('error', this.obtenerMensajeError(error));
        this.table.setData([]);
        this.tieneRegistros = false;
      },
      complete: () => {
        // Retraso para mejor UX
        setTimeout(() => {
          this.mostrarOverlayCarga = false;
        }, 500);
      }
    });
  }
  

  // =========================================
  // MÉTODOS UTILITARIOS
  // =========================================
  
  /**
   * Maneja errores de carga de imágenes
   */
  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/users/32/user-dummy-img.jpg';
  }

  /**
   * Obtiene un mensaje de error apropiado según el código de estado HTTP
   */
  private obtenerMensajeError(error: any): string {
    if (error.status === 404) return 'El endpoint no fue encontrado.';
    if (error.status === 401) return 'No autorizado. Verifica tu API Key.';
    if (error.status === 400) return 'Petición incorrecta.';
    if (error.status === 500) return 'Error interno del servidor.';
    if (error.error?.message) return error.error.message;
    return 'Error de comunicación con el servidor.';
  }

  /**
   * Extrae el resultado del stored procedure de la respuesta
   */
  private extraerResultadoSP(response: any): any {
    if (response.data && typeof response.data === 'object') {
      return response.data;
    } else if (Array.isArray(response) && response.length > 0) {
      return response[0];
    }
    return response;
  }
}