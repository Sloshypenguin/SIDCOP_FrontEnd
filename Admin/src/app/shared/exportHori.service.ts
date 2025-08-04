import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportConfig {
  title: string;
  filename: string;
  data: any[];
  columns: ExportColumn[];
  metadata?: {
    department?: string;
    user?: string;
    additionalInfo?: string;
    logoUrl?: string;
  };
}

export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
}

interface ExportResult {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private configuracionEmpresa: any = null;

  // Colores del tema (mismos del PdfReportService)
  private readonly COLORES = {
    dorado: '#D6B68A',
    azulOscuro: '#141a2f',
    blanco: '#FFFFFF',
    grisClaro: '#F8F9FA',
    grisTexto: '#666666'
  };

  constructor(private http: HttpClient) {
    this.cargarConfiguracionEmpresa();
  }

  // ===== MÉTODOS PÚBLICOS DE EXPORTACIÓN =====

  async exportToExcel(config: ExportConfig): Promise<ExportResult> {
    // TODO: Implementar exportación a Excel
    return { success: false, message: 'Exportación a Excel no implementada' };
  }

  async exportToPDF(config: ExportConfig): Promise<ExportResult> {
    try {
      this.validateConfig(config);
      
      const doc = new jsPDF('landscape');
      
      // Crear encabezado y obtener posición Y donde empezar la tabla
      const startY = await this.crearEncabezado(doc, config);
      
      // Crear tabla de datos
      await this.crearTabla(doc, config, startY);
      
      const filename = this.generateFilename(config.filename, 'pdf');
      doc.save(filename);
      
      return { success: true, message: `Archivo PDF exportado: ${filename}` };
      
    } catch (error) {
      console.error('Error exportando PDF:', error);
      return { success: false, message: 'Error al exportar archivo PDF' };
    }
  }

  async exportToCSV(config: ExportConfig): Promise<ExportResult> {
    // TODO: Implementar exportación a CSV
    return { success: false, message: 'Exportación a CSV no implementada' };
  }

  // ===== MÉTODOS PRIVADOS PARA PDF (basados en PdfReportService) =====

  private cargarConfiguracionEmpresa() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/ConfiguracionFactura/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.configuracionEmpresa = data[0];
        }
      },
      error: (error) => {
        console.error('Error al cargar configuración de empresa:', error);
      }
    });
  }

  private async cargarLogo(): Promise<string | null> {
    if (!this.configuracionEmpresa?.coFa_Logo) {
      console.log('No hay logo configurado');
      return null;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            console.error('No se pudo obtener el contexto del canvas');
            resolve(null);
            return;
          }
          
          const maxWidth = 120;
          const maxHeight = 60;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxWidth) {
              height = height * (maxWidth / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = width * (maxHeight / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/png', 0.8);
          console.log('Logo procesado correctamente desde URL');
          resolve(dataUrl);
        } catch (e) {
          console.error('Error al procesar el logo:', e);
          resolve(null);
        }
      };
      
      img.onerror = (error) => {
        console.error('Error al cargar el logo desde URL:', error);
        resolve(null);
      };
      
      try {
        const logoUrl = this.configuracionEmpresa.coFa_Logo;
        console.log('Intentando cargar logo desde:', logoUrl);
        
        if (logoUrl.startsWith('http')) {
          img.src = logoUrl;
        } else if (logoUrl.startsWith('data:')) {
          img.src = logoUrl;
        } else {
          img.src = `data:image/png;base64,${logoUrl}`;
        }
      } catch (e) {
        console.error('Error al configurar src del logo:', e);
        resolve(null);
      }
    });
  }

  private async crearEncabezado(doc: jsPDF, config: ExportConfig): Promise<number> {
    // Línea separadora en la parte inferior del encabezado
    doc.setDrawColor(this.COLORES.dorado);
    doc.setLineWidth(2);
    doc.line(20, 35, doc.internal.pageSize.width - 20, 35);

    // Cargar y agregar logo
    const logoDataUrl = await this.cargarLogo();
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', 20, 5, 30, 25);
        console.log('Logo agregado al PDF correctamente');
      } catch (e) {
        console.error('Error al agregar imagen al PDF:', e);
      }
    }

    // Nombre de la empresa
    doc.setTextColor(this.COLORES.azulOscuro);
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    const nombreEmpresa = this.configuracionEmpresa?.coFa_NombreEmpresa || 'Nombre de Empresa';
    const pageWidth = doc.internal.pageSize.width;
    doc.text(nombreEmpresa, pageWidth / 2, 15, { align: 'center' });
    
    // Título del reporte
    doc.setTextColor(this.COLORES.azulOscuro);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(config.title, pageWidth / 2, 27, { align: 'center' });

    let yPos = 38;

    // Información adicional del reporte
    if (config.metadata) {
      doc.setTextColor(this.COLORES.grisTexto);
      doc.setFontSize(10);
      

      
      if (config.metadata.additionalInfo) {
        doc.text(config.metadata.additionalInfo, 20, yPos);
        yPos += 6;
      }
      
      yPos += 3; // Espacio adicional
    }

    return yPos;
  }

  private crearPiePagina(doc: jsPDF, data: any) {
    doc.setFontSize(8);
    doc.setTextColor(this.COLORES.grisTexto);
    
    const fecha = new Date();
    const fechaTexto = fecha.toLocaleDateString('es-HN');
    const horaTexto = fecha.toLocaleTimeString('es-HN');
    const totalPages = doc.getNumberOfPages();
    
    // Información del usuario y fecha
    const usuario = this.obtenerUsuarioActual();
    doc.text(`Generado por: ${usuario} | ${fechaTexto} ${horaTexto}`, 20, doc.internal.pageSize.height - 12);
    
    // Paginación
    doc.text(`Página ${data.pageNumber}/${totalPages}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 12, { align: 'right' });
  }

  private async crearTabla(doc: jsPDF, config: ExportConfig, startY: number) {
    // Preparar datos de la tabla
    const tableData = this.prepararDatosTabla(config);
    
    // Crear la tabla con la configuración correcta de tipos
    autoTable(doc, {
      startY: startY,
      head: [tableData.headers],
      body: tableData.rows,
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak' as any,
        halign: 'left' as any,
        valign: 'middle' as any,
        lineColor: false,
        lineWidth: 0,
      },
      headStyles: {
        fillColor: this.hexToRgb(this.COLORES.azulOscuro),
        textColor: this.hexToRgb(this.COLORES.dorado),
        fontStyle: 'bold',
        fontSize: 9,
        lineColor: false,
        lineWidth: 0,
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      tableLineColor: false,
      tableLineWidth: 0,
      margin: { left: 15, right: 15, bottom: 30 },
      tableWidth: 'auto' as any,
      showHead: 'everyPage' as any,
      pageBreak: 'auto' as any,
      didDrawPage: (data: any) => {
        this.crearPiePagina(doc, data);
      }
    });
  }

  private prepararDatosTabla(config: ExportConfig): { headers: string[], rows: any[][] } {
    const headers = config.columns.map(col => col.header);
    const rows = config.data.map(item => 
      config.columns.map(col => {
        const value = item[col.key];
        return this.formatearValor(value);
      })
    );
    
    return { headers, rows };
  }

  private formatearValor(valor: any): string {
    if (valor === null || valor === undefined) {
      return '';
    }
    
    return String(valor).trim();
  }

  private obtenerUsuarioActual(): string {
    // Intentar obtener el usuario del localStorage o usar un valor por defecto
    try {
      const usuario = localStorage.getItem('currentUser');
      if (usuario) {
        const userData = JSON.parse(usuario);
        return userData.nombre || userData.username || 'Usuario';
      }
    } catch (e) {
      console.error('Error obteniendo usuario:', e);
    }
    return 'Sistema';
  }

  // ===== MÉTODOS DE UTILIDAD =====

  private validateConfig(config: ExportConfig): void {
    if (!config.title) {
      throw new Error('El título del reporte es requerido');
    }
    
    if (!config.filename) {
      throw new Error('El nombre del archivo es requerido');
    }
    
    if (!Array.isArray(config.data) || config.data.length === 0) {
      throw new Error('Los datos para exportar son requeridos');
    }
    
    if (!Array.isArray(config.columns) || config.columns.length === 0) {
      throw new Error('Las columnas para exportar son requeridas');
    }
  }

  private generateFilename(baseName: string, extension: string): string {
    const fecha = new Date();
    const timestamp = fecha.toISOString().slice(0, 19).replace(/[-:T]/g, '');
    return `${baseName}_${timestamp}.${extension}`;
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ];
    }
    return [0, 0, 0];
  }

  // Método de utilidad para formatear números (compatible con PdfReportService)
  formatearNumero(numero: number | null | undefined): string {
    if (numero === null || numero === undefined || isNaN(numero)) {
      return '0.00';
    }
    return numero.toLocaleString('es-HN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Método de utilidad para truncar texto (compatible con PdfReportService)
  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Getter para acceder a los colores desde los componentes
  get colores() {
    return this.COLORES;
  }
}