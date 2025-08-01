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
import { Modelo } from 'src/app/Modelos/general/Modelo.Model';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { DetailsComponent } from '../details/details.component';
import { FloatingMenuService } from 'src/app/shared/floating-menu.service';

// Importaciones para exportación
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Declaración de tipos para jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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
    DetailsComponent
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  // Breadcrumb items
  breadCrumbItems!: Array<{}>;

  // Acciones disponibles para el usuario
  accionesDisponibles: string[] = [];

  // Form controls
  showCreateForm = false;
  showEditForm = false;
  showDetailsForm = false;
  modeloEditando: Modelo | null = null;
  modeloDetalle: Modelo | null = null;

  // Alertas
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  // Confirmación eliminar
  mostrarConfirmacionEliminar = false;
  modeloAEliminar: Modelo | null = null;

  constructor(
    public table: ReactiveTableService<Modelo>,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public floatingMenuService: FloatingMenuService
  ) {
    this.cargarDatos();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'General' },
      { label: 'Modelos', active: true }
    ];
    this.cargarAccionesUsuario();
  }

  // ===== MÉTODOS DE EXPORTACIÓN =====

  /**
   * Exporta los datos a Excel (.xlsx)
   */
  exportarExcel(): void {
    try {
      const datos = this.obtenerDatosParaExportar();
      
      if (datos.length === 0) {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'No hay datos para exportar';
        setTimeout(() => this.mostrarAlertaWarning = false, 3000);
        return;
      }

      // Crear libro de trabajo
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      
      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, 'Modelos');
      
      // Configurar ancho de columnas
      const colWidths = [
        { wch: 8 },   // No.
        { wch: 20 },  // Marca
        { wch: 30 }   // Descripción
      ];
      ws['!cols'] = colWidths;
      
      // Generar archivo
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Modelos_${fecha}.xlsx`;
      
      XLSX.writeFile(wb, nombreArchivo);
      
      // Mostrar mensaje de éxito
      this.mostrarAlertaExito = true;
      this.mensajeExito = 'Archivo Excel exportado exitosamente';
      setTimeout(() => this.mostrarAlertaExito = false, 3000);
      
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      this.mostrarAlertaError = true;
      this.mensajeError = 'Error al exportar el archivo Excel';
      setTimeout(() => this.mostrarAlertaError = false, 3000);
    }
  }

  /**
   * Exporta los datos a PDF
   */
  exportarPDF(): void {
    try {
      const datos = this.obtenerDatosParaExportar();
      
      if (datos.length === 0) {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'No hay datos para exportar';
        setTimeout(() => this.mostrarAlertaWarning = false, 3000);
        return;
      }

      // Crear documento PDF
      const doc = new jsPDF('l', 'mm', 'a4'); // landscape, milímetros, A4
      
      // Título
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Listado de Modelos', 14, 15);
      
      // Fecha de generación
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const fechaActual = new Date().toLocaleDateString('es-ES');
      doc.text(`Fecha de generación: ${fechaActual}`, 14, 25);
      
      // Preparar datos para la tabla
      const columnas = ['No.', 'Marca', 'Descripción'];
      const filas = datos.map(item => [
        item['No.'].toString(),
        item['Marca'],
        item['Descripción']
      ]);
      
      // Generar tabla
      doc.autoTable({
        head: [columnas],
        body: filas,
        startY: 35,
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { left: 14, right: 14 }
      });
      
      // Guardar archivo
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Modelos_${fecha}.pdf`;
      doc.save(nombreArchivo);
      
      // Mostrar mensaje de éxito
      this.mostrarAlertaExito = true;
      this.mensajeExito = 'Archivo PDF exportado exitosamente';
      setTimeout(() => this.mostrarAlertaExito = false, 3000);
      
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      this.mostrarAlertaError = true;
      this.mensajeError = 'Error al exportar el archivo PDF';
      setTimeout(() => this.mostrarAlertaError = false, 3000);
    }
  }

  /**
   * Exporta los datos a CSV
   */
  exportarCSV(): void {
    try {
      const datos = this.obtenerDatosParaExportar();
      
      if (datos.length === 0) {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'No hay datos para exportar';
        setTimeout(() => this.mostrarAlertaWarning = false, 3000);
        return;
      }

      // Crear contenido CSV
      const headers = Object.keys(datos[0]);
      const csvContent = [
        headers.join(','), // Encabezados
        ...datos.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escapar valores que contengan comas o comillas
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');
      
      // Crear blob y descargar
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        
        const fecha = new Date().toISOString().split('T')[0];
        const nombreArchivo = `Modelos_${fecha}.csv`;
        link.setAttribute('download', nombreArchivo);
        
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      // Mostrar mensaje de éxito
      this.mostrarAlertaExito = true;
      this.mensajeExito = 'Archivo CSV exportado exitosamente';
      setTimeout(() => this.mostrarAlertaExito = false, 3000);
      
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      this.mostrarAlertaError = true;
      this.mensajeError = 'Error al exportar el archivo CSV';
      setTimeout(() => this.mostrarAlertaError = false, 3000);
    }
  }

  /**
   * Obtiene los datos actuales de la tabla para exportar
   */
  private obtenerDatosParaExportar(): any[] {
    // Obtener datos actuales del servicio de tabla
    const datosActuales = this.table.data$.value;
    
    // Mapear a formato para exportación
    return datosActuales.map(modelo => ({
      'No.': modelo.No,
      'Marca': modelo.maVe_Marca || '',
      'Descripción': modelo.mode_Descripcion || ''
    }));
  }

  // ===== MÉTODOS EXISTENTES =====

  // Método para validar si una acción está permitida
  accionPermitida(accion: string): boolean {
    return this.accionesDisponibles.some(a => a.trim().toLowerCase() === accion.trim().toLowerCase());
  }

  // Métodos principales de CRUD
  crear(): void {
    this.showCreateForm = !this.showCreateForm;
    this.showEditForm = false;
    this.showDetailsForm = false;
  }

  editar(modelo: Modelo): void {
    this.modeloEditando = { ...modelo };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.showDetailsForm = false;
  }

  detalles(modelo: Modelo): void {
    this.modeloDetalle = { ...modelo };
    this.showDetailsForm = true;
    this.showCreateForm = false;
    this.showEditForm = false;
  }

  confirmarEliminar(modelo: Modelo): void {
    this.modeloAEliminar = modelo;
    this.mostrarConfirmacionEliminar = true;
  }

  // Métodos para cerrar formularios
  cerrarFormulario(): void {
    this.showCreateForm = false;
  }

  cerrarFormularioEdicion(): void {
    this.showEditForm = false;
    this.modeloEditando = null;
  }

  cerrarFormularioDetalles(): void {
    this.showDetailsForm = false;
    this.modeloDetalle = null;
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacionEliminar = false;
    this.modeloAEliminar = null;
  }

  // Métodos de respuesta de componentes hijos
  guardarModelo(modelo: Modelo): void {
    this.cargarDatos();
    this.cerrarFormulario();
    this.mostrarAlertaExito = true;
    this.mensajeExito = 'Modelo guardado exitosamente';
    setTimeout(() => this.mostrarAlertaExito = false, 3000);
  }

  actualizarModelo(modelo: Modelo): void {
    this.cargarDatos();
    this.cerrarFormularioEdicion();
    this.mostrarAlertaExito = true;
    this.mensajeExito = 'Modelo actualizado exitosamente';
    setTimeout(() => this.mostrarAlertaExito = false, 3000);
  }

  // Método de eliminación optimizado
  eliminar(): void {
    if (!this.modeloAEliminar) return;

    this.http.post(`${environment.apiBaseUrl}/Modelo/Eliminar?id=${this.modeloAEliminar.mode_Id}`, {}, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: any) => {
        // Extraer resultado del SP
        const resultado = this.extraerResultadoSP(response);
        
        if (resultado.code_Status === 1) {
          // Éxito
          this.mensajeExito = resultado.message_Status || 'Modelo eliminado correctamente.';
          this.mostrarAlertaExito = true;
          setTimeout(() => {
            this.mostrarAlertaExito = false;
            this.mensajeExito = '';
          }, 3000);
          this.cargarDatos();
          this.cancelarEliminar();
          
        } else {
          // Error (-1 o 0)
          this.mostrarAlertaError = true;
          this.mensajeError = resultado.message_Status || 'Error al eliminar el modelo.';
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
          this.cancelarEliminar();
        }
      },
      error: (error) => {
        console.error('Error al eliminar modelo:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = this.obtenerMensajeError(error);
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
        this.cancelarEliminar();
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

  // Métodos privados de utilidad
  private extraerResultadoSP(response: any): any {
    if (response.data && typeof response.data === 'object') {
      return response.data;
    } else if (Array.isArray(response) && response.length > 0) {
      return response[0];
    }
    return response;
  }

  private obtenerMensajeError(error: any): string {
    if (error.status === 404) return 'El endpoint no fue encontrado.';
    if (error.status === 401) return 'No autorizado. Verifica tu API Key.';
    if (error.status === 400) return 'Petición incorrecta.';
    if (error.status === 500) return 'Error interno del servidor.';
    if (error.error?.message) return error.error.message;
    return 'Error de comunicación con el servidor.';
  }

  private cargarAccionesUsuario(): void {
    const permisosRaw = localStorage.getItem('permisosJson');
    let accionesArray: string[] = [];
    
    if (permisosRaw) {
      try {
        const permisos = JSON.parse(permisosRaw);
        let modulo = null;
        
        if (Array.isArray(permisos)) {
          modulo = permisos.find((m: any) => m.Pant_Id === 15);
        } else if (typeof permisos === 'object' && permisos !== null) {
          modulo = permisos['Modelos'] || permisos['modelos'] || null;
        }
        
        if (modulo?.Acciones && Array.isArray(modulo.Acciones)) {
          accionesArray = modulo.Acciones
            .map((a: any) => a.Accion)
            .filter((a: any) => typeof a === 'string');
        }
      } catch (e) {
        console.error('Error al parsear permisosJson:', e);
      }
    }
    
    this.accionesDisponibles = accionesArray
      .filter(a => typeof a === 'string' && a.length > 0)
      .map(a => a.trim().toLowerCase());
  }

  private cargarDatos(): void {
    this.http.get<Modelo[]>(`${environment.apiBaseUrl}/Modelo/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe(data => {
      console.log('Datos recargados:', data);

      data.forEach((modelo, index) => {
        modelo.No = index + 1;
      });

      this.table.setData(data);
    });
  }
}