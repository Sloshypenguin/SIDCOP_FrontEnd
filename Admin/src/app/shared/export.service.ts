import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Declaración de tipos para jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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
  
  // Paleta de colores corporativos optimizada
  private readonly COLORS = {
    primary: { rgb: [20, 26, 47], hex: '#141a2f' },
    secondary: { rgb: [214, 182, 138], hex: '#d6b68a' },
    primaryLight: { rgb: [35, 45, 75], hex: '#232d4b' },
    secondaryLight: { rgb: [234, 212, 182], hex: '#ead4b6' },
    white: { rgb: [255, 255, 255], hex: '#ffffff' },
    lightGray: { rgb: [248, 249, 250], hex: '#f8f9fa' },
    mediumGray: { rgb: [203, 213, 225], hex: '#cbd5e1' },
    textDark: { rgb: [15, 23, 42], hex: '#0f172a' },
    accent: { rgb: [59, 130, 246], hex: '#3b82f6' },
    success: { rgb: [34, 197, 94], hex: '#22c55e' }
  } as const;

  constructor() { }

  // ===== MÉTODOS PÚBLICOS DE EXPORTACIÓN =====

  async exportToExcel(config: ExportConfig): Promise<ExportResult> {
    try {
      this.validateConfig(config);
      
      const workbook = XLSX.utils.book_new();
      const worksheetData = this.buildExcelData(config);
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      this.applyAdvancedExcelStyles(worksheet, config);
      XLSX.utils.book_append_sheet(workbook, worksheet, this.sanitizeSheetName(config.title));
      
      const filename = this.generateFilename(config.filename, 'xlsx');
      XLSX.writeFile(workbook, filename);
      
      return { success: true, message: `Archivo Excel exportado: ${filename}` };
      
    } catch (error) {
      console.error('Error exportando Excel:', error);
      return { success: false, message: 'Error al exportar archivo Excel' };
    }
  }

  async exportToPDF(config: ExportConfig): Promise<ExportResult> {
    try {
      this.validateConfig(config);
      
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.width;
      
      // Header profesional mejorado
      this.createEnhancedPDFHeader(doc, config, pageWidth);
      
      // Información del reporte con mejor espaciado
      this.createEnhancedPDFInfo(doc, config, pageWidth);
      
      // Tabla de datos
      await this.createPDFTable(doc, config);
      
      const filename = this.generateFilename(config.filename, 'pdf');
      doc.save(filename);
      
      return { success: true, message: `Archivo PDF exportado: ${filename}` };
      
    } catch (error) {
      console.error('Error exportando PDF:', error);
      return this.createBasicPDF(config);
    }
  }

  async exportToCSV(config: ExportConfig): Promise<ExportResult> {
    try {
      this.validateConfig(config);
      
      const csvContent = this.buildCSVContent(config);
      const filename = this.generateFilename(config.filename, 'csv');
      
      this.downloadFile(csvContent, filename, 'text/csv');
      
      return { success: true, message: `Archivo CSV exportado: ${filename}` };
      
    } catch (error) {
      console.error('Error exportando CSV:', error);
      return { success: false, message: 'Error al exportar archivo CSV' };
    }
  }

  // ===== MÉTODOS PRIVADOS - EXCEL MEJORADO =====

  private buildExcelData(config: ExportConfig): any[][] {
    const metadata = this.getReportMetadata(config);
    
    return [
      // Título principal con espacio
      [`REPORTE EMPRESARIAL`],
      [config.title.toUpperCase()],
      [],
      // Sección de metadata con títulos
      ['INFORMACIÓN DEL REPORTE'],
      [],
      ...metadata.map(item => [item]),
      [],
      // Sección de estadísticas
      ['RESUMEN ESTADÍSTICO'],
      [],
      [`Total de registros: ${config.data.length}`],
      [`Columnas incluidas: ${config.columns.length}`],
      [`Fecha de generación: ${this.getCurrentDate()}`],
      [],
      // Separador visual
      ['DATOS'],
      [],
      // Encabezados de tabla
      config.columns.map(col => col.header),
      // Datos
      ...config.data.map(item => 
        config.columns.map(col => this.cleanValue(item[col.key]))
      )
    ];
  }

  private applyAdvancedExcelStyles(worksheet: XLSX.WorkSheet, config: ExportConfig): void {
    if (!worksheet['!ref']) return;
    
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const metadataRows = this.getReportMetadata(config).length;
    const dataStartRow = metadataRows + 11; // Ajustado para el nuevo diseño
    
    // Título principal (fila 1)
    this.setExcelCellStyle(worksheet, 'A1', {
      font: { bold: true, sz: 24, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: this.COLORS.primary.hex.substring(1) } },
      alignment: { horizontal: 'center', vertical: 'center' }
    });
    
    // Subtítulo (fila 2)
    this.setExcelCellStyle(worksheet, 'A2', {
      font: { bold: true, sz: 16, color: { rgb: this.COLORS.primary.hex.substring(1) } },
      fill: { fgColor: { rgb: this.COLORS.secondaryLight.hex.substring(1) } },
      alignment: { horizontal: 'center', vertical: 'center' }
    });
    
    // Título de sección "INFORMACIÓN DEL REPORTE" (fila 4)
    this.setExcelCellStyle(worksheet, 'A4', {
      font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: this.COLORS.secondary.hex.substring(1) } },
      alignment: { horizontal: 'center', vertical: 'center' }
    });
    
    // Estilos de metadata (filas 6 en adelante)
    for (let row = 6; row <= 5 + metadataRows; row++) {
      this.setExcelCellStyle(worksheet, `A${row}`, {
        font: { sz: 11, color: { rgb: this.COLORS.textDark.hex.substring(1) } },
        fill: { fgColor: { rgb: this.COLORS.lightGray.hex.substring(1) } },
        alignment: { horizontal: 'left', vertical: 'center' }
      });
    }
    
    // Título "RESUMEN ESTADÍSTICO"
    const statsRow = 6 + metadataRows + 1;
    this.setExcelCellStyle(worksheet, `A${statsRow}`, {
      font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: this.COLORS.accent.hex.substring(1) } },
      alignment: { horizontal: 'center', vertical: 'center' }
    });
    
    // Estadísticas (3 filas después del título)
    for (let row = statsRow + 2; row <= statsRow + 4; row++) {
      this.setExcelCellStyle(worksheet, `A${row}`, {
        font: { sz: 10, color: { rgb: this.COLORS.textDark.hex.substring(1) } },
        fill: { fgColor: { rgb: this.COLORS.white.hex.substring(1) } },
        alignment: { horizontal: 'left', vertical: 'center' }
      });
    }
    
    // Título "DATOS"
    const dataTitleRow = statsRow + 6;
    this.setExcelCellStyle(worksheet, `A${dataTitleRow}`, {
      font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: this.COLORS.success.hex.substring(1) } },
      alignment: { horizontal: 'center', vertical: 'center' }
    });
    
    // Encabezados de tabla
    const headerRow = dataStartRow;
    for (let col = 0; col < config.columns.length; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: headerRow, c: col });
      this.setExcelCellStyle(worksheet, cellRef, {
        font: { bold: true, sz: 12, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: this.COLORS.primary.hex.substring(1) } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: this.COLORS.mediumGray.hex.substring(1) } },
          bottom: { style: 'thin', color: { rgb: this.COLORS.mediumGray.hex.substring(1) } },
          left: { style: 'thin', color: { rgb: this.COLORS.mediumGray.hex.substring(1) } },
          right: { style: 'thin', color: { rgb: this.COLORS.mediumGray.hex.substring(1) } }
        }
      });
    }
    
    // Datos con filas alternas y bordes
    for (let row = headerRow + 1; row <= range.e.r; row++) {
      const isEvenRow = (row - headerRow - 1) % 2 === 0;
      for (let col = 0; col < config.columns.length; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        this.setExcelCellStyle(worksheet, cellRef, {
          font: { sz: 10, color: { rgb: this.COLORS.textDark.hex.substring(1) } },
          fill: { fgColor: { rgb: isEvenRow ? 'FFFFFF' : this.COLORS.lightGray.hex.substring(1) } },
          alignment: { horizontal: config.columns[col].align || 'left', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: this.COLORS.mediumGray.hex.substring(1) } },
            bottom: { style: 'thin', color: { rgb: this.COLORS.mediumGray.hex.substring(1) } },
            left: { style: 'thin', color: { rgb: this.COLORS.mediumGray.hex.substring(1) } },
            right: { style: 'thin', color: { rgb: this.COLORS.mediumGray.hex.substring(1) } }
          }
        });
      }
    }
    
    // Configurar anchos de columna mejorados
    worksheet['!cols'] = config.columns.map(col => ({ wch: col.width || 25 }));
    
    // Fusiones de celdas mejoradas
    worksheet['!merges'] = [
      // Título principal
      { s: { r: 0, c: 0 }, e: { r: 0, c: config.columns.length - 1 } },
      // Subtítulo
      { s: { r: 1, c: 0 }, e: { r: 1, c: config.columns.length - 1 } },
      // Sección información
      { s: { r: 3, c: 0 }, e: { r: 3, c: config.columns.length - 1 } },
      // Metadata
      ...Array.from({ length: metadataRows }, (_, i) => ({
        s: { r: i + 5, c: 0 }, e: { r: i + 5, c: config.columns.length - 1 }
      })),
      // Sección estadísticas
      { s: { r: statsRow - 1, c: 0 }, e: { r: statsRow - 1, c: config.columns.length - 1 } },
      // Estadísticas
      { s: { r: statsRow + 1, c: 0 }, e: { r: statsRow + 1, c: config.columns.length - 1 } },
      { s: { r: statsRow + 2, c: 0 }, e: { r: statsRow + 2, c: config.columns.length - 1 } },
      { s: { r: statsRow + 3, c: 0 }, e: { r: statsRow + 3, c: config.columns.length - 1 } },
      // Título datos
      { s: { r: dataTitleRow - 1, c: 0 }, e: { r: dataTitleRow - 1, c: config.columns.length - 1 } }
    ];
    
    // Altura de filas para mejor presentación
    worksheet['!rows'] = [
      { hpt: 30 }, // Título principal
      { hpt: 25 }, // Subtítulo
      { hpt: 15 }, // Espacio
      { hpt: 20 }, // Sección información
      { hpt: 15 }, // Espacio
      ...Array.from({ length: metadataRows }, () => ({ hpt: 18 })), // Metadata
      { hpt: 15 }, // Espacio
      { hpt: 20 }, // Sección estadísticas
      { hpt: 15 }, // Espacio
      { hpt: 18 }, // Estadística 1
      { hpt: 18 }, // Estadística 2
      { hpt: 18 }, // Estadística 3
      { hpt: 15 }, // Espacio
      { hpt: 20 }, // Título datos
      { hpt: 15 }, // Espacio
      { hpt: 22 }, // Headers
      ...Array.from({ length: config.data.length }, () => ({ hpt: 20 })) // Data rows
    ];
  }

  private setExcelCellStyle(worksheet: XLSX.WorkSheet, cellRef: string, style: any): void {
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = style;
    }
  }

  // ===== MÉTODOS PRIVADOS - PDF MEJORADO =====

  private createEnhancedPDFHeader(doc: jsPDF, config: ExportConfig, pageWidth: number): void {
    // Fondo principal con gradiente simulado
    doc.setFillColor(...this.COLORS.primary.rgb);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Franja superior decorativa
    doc.setFillColor(...this.COLORS.secondary.rgb);
    doc.rect(0, 0, pageWidth, 4, 'F');
    
    // Franja inferior decorativa
    doc.setFillColor(...this.COLORS.secondary.rgb);
    doc.rect(0, 46, pageWidth, 4, 'F');
    
    // Líneas decorativas internas
    doc.setDrawColor(...this.COLORS.secondaryLight.rgb);
    doc.setLineWidth(0.5);
    doc.line(20, 8, pageWidth - 20, 8);
    doc.line(20, 42, pageWidth - 20, 42);
    
    // Título principal
    doc.setTextColor(...this.COLORS.white.rgb);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE EMPRESARIAL', pageWidth / 2, 20, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(config.title, pageWidth / 2, 30, { align: 'center' });
    
    // Fecha en el header
    doc.setFontSize(10);
    doc.setTextColor(...this.COLORS.secondaryLight.rgb);
    doc.text(`Generado: ${this.getCurrentDate()}`, pageWidth / 2, 38, { align: 'center' });
  }

  private createEnhancedPDFInfo(doc: jsPDF, config: ExportConfig, pageWidth: number): void {
    const startY = 55;
    const metadata = this.getReportMetadata(config);
    
    // Fondo de información con bordes redondeados simulados
    doc.setFillColor(...this.COLORS.lightGray.rgb);
    doc.rect(15, startY, pageWidth - 30, 35, 'F');
    
    // Borde decorativo
    doc.setDrawColor(...this.COLORS.secondary.rgb);
    doc.setLineWidth(1);
    doc.rect(15, startY, pageWidth - 30, 35);
    
    // Título de la sección
    doc.setFillColor(...this.COLORS.primary.rgb);
    doc.rect(20, startY + 3, pageWidth - 40, 8, 'F');
    
    doc.setTextColor(...this.COLORS.white.rgb);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL REPORTE', pageWidth / 2, startY + 8, { align: 'center' });
    
    // Información en dos columnas con mejor espaciado
    doc.setTextColor(...this.COLORS.textDark.rgb);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const leftColumn = metadata.slice(0, Math.ceil(metadata.length / 2));
    const rightColumn = metadata.slice(Math.ceil(metadata.length / 2));
    
    // Columna izquierda
    leftColumn.forEach((item, index) => {
      doc.text(`• ${item}`, 25, startY + 18 + (index * 6));
    });
    
    // Columna derecha
    rightColumn.forEach((item, index) => {
      doc.text(`• ${item}`, pageWidth / 2 + 10, startY + 18 + (index * 6));
    });
    
    // Estadísticas adicionales
    doc.setFillColor(...this.COLORS.accent.rgb);
    doc.rect(20, startY + 28, pageWidth - 40, 5, 'F');
    
    doc.setTextColor(...this.COLORS.white.rgb);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${config.data.length} registros | ${config.columns.length} columnas | SIDCOP`, pageWidth / 2, startY + 31.5, { align: 'center' });
  }

  private async createPDFTable(doc: jsPDF, config: ExportConfig): Promise<void> {
    const columns = config.columns.map(col => ({
      header: col.header,
      dataKey: col.key
    }));
    
    const body = config.data.map(item => {
      const row: any = {};
      config.columns.forEach(col => {
        row[col.key] = this.cleanValue(item[col.key]);
      });
      return row;
    });
    
    if (typeof doc.autoTable === 'function') {
      doc.autoTable({
        columns,
        body,
        startY: 95, // Ajustado para el nuevo header
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: this.COLORS.textDark.rgb,
          lineColor: this.COLORS.mediumGray.rgb,
          lineWidth: 0.5
        },
        headStyles: {
          fillColor: this.COLORS.primary.rgb,
          textColor: this.COLORS.white.rgb,
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center',
          minCellHeight: 12
        },
        bodyStyles: {
          minCellHeight: 10,
          alternateRowStyles: {
            fillColor: this.COLORS.lightGray.rgb
          }
        },
        columnStyles: this.getColumnStyles(config.columns),
        margin: { left: 15, right: 15 },
        didDrawPage: (data: any) => {
          this.addEnhancedPDFFooter(doc, data.pageNumber, data.pageCount || 1);
        }
      });
    } else {
      this.createManualTable(doc, config, 95);
    }
  }

  private addEnhancedPDFFooter(doc: jsPDF, pageNumber: number, totalPages: number): void {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Fondo del footer
    doc.setFillColor(...this.COLORS.primary.rgb);
    doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
    
    // Franja decorativa superior
    doc.setFillColor(...this.COLORS.secondary.rgb);
    doc.rect(0, pageHeight - 18, pageWidth, 2, 'F');
    
    // Información del footer con mejor espaciado
    doc.setTextColor(...this.COLORS.white.rgb);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    // Izquierda: Fecha
    doc.text(`Generado: ${this.getCurrentDate()}`, 15, pageHeight - 8);
    
    // Centro: Sistema
    doc.text('SIDCOP', pageWidth / 2, pageHeight - 8, { align: 'center' });
    
    // Derecha: Paginación
    doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - 15, pageHeight - 8, { align: 'right' });
    
    // Línea decorativa
    doc.setDrawColor(...this.COLORS.secondaryLight.rgb);
    doc.setLineWidth(0.3);
    doc.line(15, pageHeight - 12, pageWidth - 15, pageHeight - 12);
  }

  private createBasicPDF(config: ExportConfig): ExportResult {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Header básico mejorado
      doc.setFillColor(...this.COLORS.primary.rgb);
      doc.rect(0, 0, doc.internal.pageSize.width, 25, 'F');
      
      doc.setTextColor(...this.COLORS.white.rgb);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORTE EMPRESARIAL', doc.internal.pageSize.width / 2, 12, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(config.title, doc.internal.pageSize.width / 2, 19, { align: 'center' });
      
      this.createManualTable(doc, config, 35);
      
      const filename = this.generateFilename(config.filename, 'pdf');
      doc.save(filename);
      
      return { success: true, message: `PDF básico exportado: ${filename}` };
      
    } catch (error) {
      console.error('Error en PDF básico:', error);
      return { success: false, message: 'Error crítico al generar PDF' };
    }
  }

  private createManualTable(doc: jsPDF, config: ExportConfig, startY: number): void {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.width;
    const colWidth = (pageWidth - 30) / config.columns.length; // Más margen
    
    // Headers con mejor diseño
    doc.setFillColor(...this.COLORS.primary.rgb);
    doc.rect(15, yPosition - 6, pageWidth - 30, 12, 'F');
    
    doc.setTextColor(...this.COLORS.white.rgb);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    
    config.columns.forEach((col, index) => {
      const x = 15 + (index * colWidth) + (colWidth / 2);
      doc.text(col.header, x, yPosition, { align: 'center' });
    });
    
    yPosition += 10;
    
    // Data rows con mejor espaciado
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...this.COLORS.textDark.rgb);
    
    config.data.forEach((item, index) => {
      if (yPosition > doc.internal.pageSize.height - 35) {
        doc.addPage();
        yPosition = 25;
      }
      
      // Fila alterna con mejor contraste
      if (index % 2 === 0) {
        doc.setFillColor(...this.COLORS.lightGray.rgb);
        doc.rect(15, yPosition - 4, pageWidth - 30, 10, 'F');
      }
      
      config.columns.forEach((col, colIndex) => {
        const x = 15 + (colIndex * colWidth) + 3;
        const text = String(this.cleanValue(item[col.key])).substring(0, 30);
        doc.text(text, x, yPosition + 2);
      });
      
      yPosition += 10;
    });
    
    this.addEnhancedPDFFooter(doc, 1, 1);
  }

  // ===== MÉTODOS PRIVADOS - CSV =====

  private buildCSVContent(config: ExportConfig): string {
    const separator = '='.repeat(80);
    const metadata = this.getReportMetadata(config);
    
    const lines = [
      separator,
      `REPORTE EMPRESARIAL - ${config.title.toUpperCase()}`,
      separator,
      '',
      'INFORMACIÓN DEL REPORTE:',
      ''.padEnd(40, '-'),
      ...metadata,
      '',
      'RESUMEN ESTADÍSTICO:',
      ''.padEnd(40, '-'),
      `Total de registros: ${config.data.length}`,
      `Columnas incluidas: ${config.columns.length}`,
      `Fecha de generación: ${this.getCurrentDate()}`,
      '',
      'DATOS DEL REPORTE:',
      ''.padEnd(40, '-'),
      '',
      config.columns.map(col => col.header).join(','),
      ...config.data.map(row => 
        config.columns.map(col => this.escapeCSV(row[col.key])).join(',')
      ),
      '',
      separator,
      `Archivo generado por SIDCOP`,
      `Fecha y hora: ${new Date().toISOString()}`,
      separator
    ];
    
    return '\uFEFF' + lines.join('\n');
  }

  // ===== MÉTODOS DE UTILIDAD =====

  private validateConfig(config: ExportConfig): void {
    if (!config.data || !Array.isArray(config.data) || config.data.length === 0) {
      throw new Error('No hay datos para exportar');
    }
    if (!config.columns || config.columns.length === 0) {
      throw new Error('No se han definido columnas');
    }
  }

  private getReportMetadata(config: ExportConfig): string[] {
    const metadata = [
      `Fecha de Generación: ${this.getCurrentDate()}`,
      `Total de Registros: ${config.data.length}`,
    ];
    
    if (config.metadata?.department) {
      metadata.push(`Departamento: ${config.metadata.department}`);
    }
    
    if (config.metadata?.user) {
      metadata.push(`Usuario: ${config.metadata.user}`);
    }
    
    if (config.metadata?.additionalInfo) {
      metadata.push(`Información: ${config.metadata.additionalInfo}`);
    }
    
    return metadata;
  }

  private getColumnStyles(columns: ExportColumn[]): any {
    const styles: any = {};
    columns.forEach(col => {
      styles[col.key] = {
        halign: col.align || 'left',
        cellWidth: col.width ? (col.width * 2.8) : 'auto'
      };
    });
    return styles;
  }

  private cleanValue(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value)
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-.,;:()\[\]]/g, '')
      .trim()
      .substring(0, 100);
  }

  private escapeCSV(value: any): string {
    if (!value) return '';
    let stringValue = this.cleanValue(value);
    
    if (stringValue.includes(',') || stringValue.includes('"')) {
      stringValue = `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  }

  private getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Tegucigalpa'
    });
  }

  private generateFilename(base: string, extension: string): string {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .substring(0, 19);
    return `${base}_${timestamp}.${extension}`;
  }

  private sanitizeSheetName(name: string): string {
    return name
      .replace(/[\\\/\?\*\[\]:]/g, '')
      .replace(/[^\w\s\-]/g, '')
      .substring(0, 31);
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }
}