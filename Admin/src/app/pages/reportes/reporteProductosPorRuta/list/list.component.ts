// reporte-productos.component.ts - VERSIÓN SIMPLIFICADA
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PdfReportService, ReportConfig, TableData } from 'src/app/reporteGlobal';
@Component({
  selector: 'app-reporte-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ReporteProductosPorRutaComponent implements OnInit {
  productos: any[] = [];
  pdfUrl: SafeResourceUrl | null = null;
  cargando = false;

  // Filtros
  rutas: any[] = [];
  rutaSeleccionada: number | null = null;

  constructor(
    private http: HttpClient, 
    private sanitizer: DomSanitizer,
    private pdfService: PdfReportService // ¡Inyectar el servicio!
  ) {}

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.cargando = true;
    
    // Cargar Rutas
    this.http.get<any[]>(`${environment.apiBaseUrl}/Rutas/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.rutas = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar rutas:', error);
        this.cargando = false;
      }
    });
  }

  generarReporte() {
    this.cargando = true;
    
    // Parámetros para el SP
    const params: any = {};
    if (this.rutaSeleccionada) params.rutaId = this.rutaSeleccionada;

    this.http.get<any[]>(`${environment.apiBaseUrl}/Reportes/ReporteProductosPorRuta`, {
      headers: { 'x-api-key': environment.apiKey },
      params: params
    }).subscribe({
      next: (data) => {
        this.productos = data;
        this.generarPDF();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al generar reporte:', error);
        this.cargando = false;
      }
    });
  }

  async generarPDF() {
    // CONFIGURACIÓN DEL REPORTE
    const config: ReportConfig = {
      titulo: 'REPORTE DE PRODUCTOS VENDIDOS POR RUTA',
      orientacion: 'landscape',
      mostrarResumen: true,
      textoResumen: `Total de productos: ${this.productos.length}`,
      filtros: this.construirFiltros()
    };

    //  DATOS DE LA TABLA
    const tableData: TableData = {
      head: [
        [
          { content: '#', styles: { halign: 'center', cellWidth: 15 } },
          { content: 'DNI', styles: { cellWidth: 32 } },
          { content: 'Vendedor', styles: { cellWidth: 60 } },
          { content: 'Ruta', styles: { cellWidth: 35 } },
          { content: 'Producto', styles: { cellWidth: 50 } },
          { content: 'Cantidad', styles: { cellWidth: 20 } }
        ]
      ],
      body: this.productos.map((p, index) => [
        { content: (index + 1).toString(), styles: { halign: 'center' } },
        p.vend_DNI || 'N/A',
        p.nombreCompleto || 'N/A',
        p.ruta_Descripcion || 'N/A',
        p.prod_DescripcionCorta || 'N/A',
        p.cantidadVendida || 'N/A'
      ])
    };

    // GENERAR EL PDF
    try {
      const pdfBlob = await this.pdfService.generarReportePDF(config, tableData, this.productos);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  }

  //aqui van los filtros
  private construirFiltros(): { label: string; valor: string }[] {
    const filtros: { label: string; valor: string }[] = [];

    if (this.rutaSeleccionada) {
      const ruta = this.rutas.find(c => c.ruta_Id === this.rutaSeleccionada);
      filtros.push({ label: 'Ruta', valor: ruta?.ruta_Descripcion || 'N/A' });
    }

    return filtros;
  }

  limpiarFiltros() {
    this.rutaSeleccionada = null;
  }
}