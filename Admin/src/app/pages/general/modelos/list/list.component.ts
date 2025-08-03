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


  // ===== MÉTODOS DE EXPORTACIÓN OPTIMIZADOS =====

/**
 * Exporta los datos a Excel con diseño básico
 */
exportarExcel(): void {
  try {
    const datos = this.obtenerDatosParaExportar();
    
    if (datos.length === 0) {
      this.mostrarMensaje('warning', 'No hay datos para exportar');
      return;
    }

    // Crear hoja de trabajo con estilos básicos
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    // Configurar anchos de columnas
    ws['!cols'] = [
      { wch: 10 },  // No.
      { wch: 25 },  // Marca
      { wch: 40 }   // Descripción
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Modelos');
    
    // Guardar archivo
    const nombreArchivo = `Modelos_${this.obtenerFechaArchivo()}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
    
    this.mostrarMensaje('success', 'Archivo Excel exportado exitosamente');
    
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    this.mostrarMensaje('error', 'Error al exportar el archivo Excel');
  }
}

/**
 * Exporta los datos a PDF (versión simplificada y funcional)
 */
exportarPDF(): void {
  try {
    const datos = this.obtenerDatosParaExportar();
    
    if (datos.length === 0) {
      this.mostrarMensaje('warning', 'No hay datos para exportar');
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Encabezado
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('LISTADO DE MODELOS', 14, 15);
    
    // Información
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 25);
    doc.text(`Total: ${datos.length} registros`, 14, 30);
    
    // Verificar si autoTable está disponible
    if (typeof doc.autoTable === 'function') {
      // Usar autoTable si está disponible
      const columnas = ['No.', 'Marca', 'Descripcion'];
      const filas = datos.map(item => [
        String(item['No.']),
        this.limpiarTexto(item['Marca']),
        this.limpiarTexto(item['Descripción'])
      ]);
      
      doc.autoTable({
        head: [columnas],
        body: filas,
        startY: 35,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [52, 73, 94], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 14, right: 14 }
      });
    } else {
      // Método alternativo sin autoTable
      this.generarTablaManual(doc, datos);
    }
    
    // Guardar archivo
    const nombreArchivo = `Modelos_${this.obtenerFechaArchivo()}.pdf`;
    doc.save(nombreArchivo);
    
    this.mostrarMensaje('success', 'Archivo PDF exportado exitosamente');
    
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    // Intentar método de respaldo
    this.exportarPDFBasico();
  }
}

/**
 * Genera tabla manual en PDF sin autoTable
 */
private generarTablaManual(doc: jsPDF, datos: any[]): void {
  let yPosition = 40;
  doc.setFontSize(10);
  
  // Encabezados
  doc.setFont('helvetica', 'bold');
  doc.text('No.', 14, yPosition);
  doc.text('Marca', 30, yPosition);
  doc.text('Descripcion', 80, yPosition);
  
  // Línea separadora
  doc.line(14, yPosition + 2, 200, yPosition + 2);
  yPosition += 8;
  
  // Datos
  doc.setFont('helvetica', 'normal');
  datos.forEach((item) => {
    if (yPosition > 190) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(String(item['No.']), 14, yPosition);
    doc.text(this.limpiarTexto(item['Marca']), 30, yPosition);
    doc.text(this.limpiarTexto(item['Descripción']), 80, yPosition);
    
    yPosition += 6;
  });
}

/**
 * Método de respaldo para PDF básico
 */
private exportarPDFBasico(): void {
  try {
    const datos = this.obtenerDatosParaExportar();
    const doc = new jsPDF('l', 'mm', 'a4');
    
    doc.setFontSize(14);
    doc.text('LISTADO DE MODELOS', 14, 15);
    
    this.generarTablaManual(doc, datos);
    
    const nombreArchivo = `Modelos_${this.obtenerFechaArchivo()}.pdf`;
    doc.save(nombreArchivo);
    
    this.mostrarMensaje('success', 'Archivo PDF exportado (versión básica)');
    
  } catch (error) {
    console.error('Error en PDF básico:', error);
    this.mostrarMensaje('error', 'Error crítico al generar PDF');
  }
}

/**
 * Exporta los datos a CSV con UTF-8
 */
exportarCSV(): void {
  try {
    const datos = this.obtenerDatosParaExportar();
    
    if (datos.length === 0) {
      this.mostrarMensaje('warning', 'No hay datos para exportar');
      return;
    }

    // Crear contenido CSV
    const headers = Object.keys(datos[0]);
    const csvRows = [
      headers.join(','),
      ...datos.map(row => 
        headers.map(header => this.escaparCSV(row[header])).join(',')
      )
    ];
    
    // Agregar BOM para UTF-8
    const csvContent = '\uFEFF' + csvRows.join('\n');
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = `Modelos_${this.obtenerFechaArchivo()}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    this.mostrarMensaje('success', 'Archivo CSV exportado exitosamente');
    
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    this.mostrarMensaje('error', 'Error al exportar el archivo CSV');
  }
}

// ===== MÉTODOS DE UTILIDAD OPTIMIZADOS =====

/**
 * Obtiene datos limpios para exportar
 */
private obtenerDatosParaExportar(): any[] {
  try {
    const datosActuales = this.table.data$.value;
    
    if (!Array.isArray(datosActuales)) return [];
    
    return datosActuales.map((modelo, index) => ({
      'No.': modelo?.No || (index + 1),
      'Marca': this.limpiarTexto(modelo?.maVe_Marca),
      'Descripción': this.limpiarTexto(modelo?.mode_Descripcion)
    }));
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return [];
  }
}

/**
 * Limpia texto para exportación
 */
private limpiarTexto(texto: any): string {
  if (!texto) return '';
  
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^\x20-\x7E]/g, '') // Solo caracteres ASCII
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 100);
}

/**
 * Escapa valores para CSV
 */
private escaparCSV(value: any): string {
  if (!value) return '';
  
  let stringValue = String(value).replace(/[\r\n]/g, ' ');
  
  if (stringValue.includes(',') || stringValue.includes('"')) {
    stringValue = `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Obtiene fecha formateada para nombres de archivo
 */
private obtenerFechaArchivo(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Muestra mensajes de alerta de forma centralizada
 */
private mostrarMensaje(tipo: 'success' | 'error' | 'warning', mensaje: string): void {
  // Limpiar alertas previas
  this.cerrarAlerta();
  
  switch (tipo) {
    case 'success':
      this.mostrarAlertaExito = true;
      this.mensajeExito = mensaje;
      setTimeout(() => this.mostrarAlertaExito = false, 3000);
      break;
    case 'error':
      this.mostrarAlertaError = true;
      this.mensajeError = mensaje;
      setTimeout(() => this.mostrarAlertaError = false, 5000);
      break;
    case 'warning':
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = mensaje;
      setTimeout(() => this.mostrarAlertaWarning = false, 3000);
      break;
  }
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