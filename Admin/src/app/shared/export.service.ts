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
    company?: string;
    reportType?: string;
  };
}

export interface ExportColumn {
  key: string;
  header: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'number' | 'currency' | 'date' | 'percentage';
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  
  // Colores corporativos específicos mejorados
  private readonly COLORS = {
    // Colores principales
    primary: [20, 26, 47] as [number, number, number],          // #141a2f - Azul principal
    secondary: [214, 182, 138] as [number, number, number],     // #d6b68a - Dorado principal
    
    // Variaciones del azul principal
    primaryLight: [35, 45, 75] as [number, number, number],     // Azul más claro
    primaryDark: [15, 20, 35] as [number, number, number],      // Azul más oscuro
    primaryUltraLight: [65, 75, 105] as [number, number, number], // Azul ultra claro
    
    // Variaciones del dorado
    secondaryLight: [234, 212, 182] as [number, number, number], // Dorado claro
    secondaryDark: [180, 155, 115] as [number, number, number],  // Dorado oscuro
    secondaryUltraLight: [248, 238, 220] as [number, number, number], // Dorado ultra claro
    
    // Neutros mejorados
    white: [255, 255, 255] as [number, number, number],
    lightGray: [248, 249, 250] as [number, number, number],
    mediumGray: [203, 213, 225] as [number, number, number],
    darkGray: [71, 85, 105] as [number, number, number],
    black: [15, 23, 42] as [number, number, number],
    
    // Colores de acento
    success: [34, 197, 94] as [number, number, number],
    warning: [251, 191, 36] as [number, number, number],
    error: [239, 68, 68] as [number, number, number],
    info: [59, 130, 246] as [number, number, number]
  };

  // Configuraciones de estilo mejoradas
  private readonly STYLES = {
    fonts: {
      title: { size: 20, weight: 'bold' },
      subtitle: { size: 14, weight: 'bold' },
      header: { size: 12, weight: 'bold' },
      body: { size: 10, weight: 'normal' },
      small: { size: 8, weight: 'normal' },
      footer: { size: 8, weight: 'normal' }
    },
    spacing: {
      headerHeight: 55,
      infoHeight: 35,
      footerHeight: 25,
      marginX: 15,
      marginY: 10,
      lineSpacing: 1.2
    }
  };

  constructor() { }

  /**
   * Exporta datos a Excel con diseño profesional mejorado
   */
  async exportToExcel(config: ExportConfig): Promise<{ success: boolean; message: string }> {
    try {
      if (!config.data || config.data.length === 0) {
        return { success: false, message: 'No hay datos para exportar' };
      }

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      
      // Crear estructura del reporte mejorada
      const companyName = config.metadata?.company || 'LA ROCA';
      const reportType = config.metadata?.reportType || 'INFORME EJECUTIVO';
      
      const datosConEncabezado = [
        [`${companyName} - ${reportType}`], // Título principal
        [`${config.title.toUpperCase()}`], // Subtítulo
        [], // Separador
        [`═══════════════════════════════════════════════════════════════════`],
        [`📊 INFORMACIÓN DEL REPORTE`],
        [`═══════════════════════════════════════════════════════════════════`],
        [`📅 Fecha de Generación: ${this.getFechaCompleta()}`],
        [`📈 Total de Registros: ${config.data.length.toLocaleString('es-ES')} elementos`],
        [`👤 Usuario Responsable: ${config.metadata?.user || 'Sistema Automatizado'}`],
        ...(config.metadata?.department ? [[`🏢 Departamento: ${config.metadata.department}`]] : []),
        ...(config.metadata?.additionalInfo ? [[`ℹ️ Información Adicional: ${config.metadata.additionalInfo}`]] : []),
        [`🔒 Nivel de Confidencialidad: Interno`],
        [`═══════════════════════════════════════════════════════════════════`],
        [], // Separador antes de la tabla
        config.columns.map(col => col.header), // Encabezados
        ...config.data.map(item => 
          config.columns.map(col => this.formatCellValue(item[col.key], col.format))
        )
      ];

      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(datosConEncabezado);
      
      this.applyEnhancedExcelStyles(ws, config);
      
      XLSX.utils.book_append_sheet(wb, ws, this.sanitizeSheetName(config.title));
      
      const nombreArchivo = `${config.filename}_${this.getFileDate()}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
      
      return { success: true, message: 'Archivo Excel exportado exitosamente con diseño profesional mejorado' };
      
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      return { success: false, message: 'Error al exportar el archivo Excel' };
    }
  }

  /**
   * Exporta datos a PDF con diseño profesional mejorado
   */
  async exportToPDF(config: ExportConfig): Promise<{ success: boolean; message: string }> {
    try {
      if (!config.data || config.data.length === 0) {
        return { success: false, message: 'No hay datos para exportar' };
      }

      // Formato vertical (portrait) con configuración mejorada
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pageWidth = doc.internal.pageSize.width;
      
      await this.createEnhancedPDFHeader(doc, config, pageWidth);
      this.createEnhancedPDFInfo(doc, config, pageWidth);
      
      if (typeof doc.autoTable === 'function') {
        this.createEnhancedPDFTable(doc, config);
      } else {
        this.createManualEnhancedPDFTable(doc, config, this.STYLES.spacing.headerHeight + this.STYLES.spacing.infoHeight);
      }
      
      const nombreArchivo = `${config.filename}_${this.getFileDate()}.pdf`;
      doc.save(nombreArchivo);
      
      return { success: true, message: 'Archivo PDF exportado exitosamente con diseño profesional mejorado' };
      
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      return this.exportEnhancedBasicPDF(config);
    }
  }

  /**
   * Exporta datos a CSV con formato profesional mejorado
   */
  async exportToCSV(config: ExportConfig): Promise<{ success: boolean; message: string }> {
    try {
      if (!config.data || config.data.length === 0) {
        return { success: false, message: 'No hay datos para exportar' };
      }

      const separator = '═'.repeat(80);
      const doubleSeparator = '╔' + '═'.repeat(78) + '╗';
      const endSeparator = '╚' + '═'.repeat(78) + '╝';
      const minorSeparator = '─'.repeat(60);
      
      const companyName = config.metadata?.company || 'LA ROCA';
      const reportType = config.metadata?.reportType || 'INFORME EJECUTIVO';
      
      const encabezado = [
        doubleSeparator,
        `║ ${this.centerText(`${companyName} - ${reportType}`, 76)} ║`,
        `║ ${this.centerText(`${config.title.toUpperCase()}`, 76)} ║`,
        `║ ${this.centerText(`Generado el ${this.getFechaCompleta()}`, 76)} ║`,
        endSeparator,
        '',
        '📊 INFORMACIÓN DETALLADA DEL REPORTE',
        separator,
        `📅 Fecha de Generación: ${this.getFechaCompleta()}`,
        `📈 Total de Registros: ${config.data.length.toLocaleString('es-ES')} elementos procesados`,
        `👤 Usuario Responsable: ${config.metadata?.user || 'Sistema Automatizado'}`,
        ...(config.metadata?.department ? [`🏢 Departamento/Módulo: ${config.metadata.department}`] : []),
        ...(config.metadata?.additionalInfo ? [`ℹ️ Información Adicional: ${config.metadata.additionalInfo}`] : []),
        `🔒 Clasificación: Documento Interno Confidencial`,
        `🌐 Zona Horaria: America/Tegucigalpa (GMT-6)`,
        '',
        minorSeparator,
        '📋 INICIO DE DATOS TABULARES',
        minorSeparator,
        ''
      ];
      
      const headers = config.columns.map(col => `"${col.header}"`);
      const csvRows = [
        ...encabezado,
        headers.join(','),
        ...config.data.map(row => 
          config.columns.map(col => this.escapeCSV(this.formatCellValue(row[col.key], col.format))).join(',')
        ),
        '',
        minorSeparator,
        '📄 FIN DE DATOS TABULARES',
        minorSeparator,
        '',
        `📊 RESUMEN ESTADÍSTICO:`,
        `   • Total de registros procesados: ${config.data.length.toLocaleString('es-ES')}`,
        `   • Número de columnas: ${config.columns.length}`,
        `   • Archivo generado automáticamente: ${new Date().toISOString()}`,
        `   • Sistema: Gestión Empresarial Avanzada v2.0`,
        '',
        separator,
        `🔐 AVISO LEGAL: Este documento es propiedad de ${companyName} y contiene`,
        `información confidencial. Su distribución está limitada a personal autorizado.`,
        separator,
        `📧 Para consultas técnicas, contacte al administrador del sistema.`,
        endSeparator
      ];
      
      const csvContent = '\uFEFF' + csvRows.join('\n');
      this.downloadFile(csvContent, `${config.filename}_${this.getFileDate()}.csv`, 'text/csv');
      
      return { success: true, message: 'Archivo CSV exportado exitosamente con formato profesional mejorado' };
      
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      return { success: false, message: 'Error al exportar el archivo CSV' };
    }
  }

  // ===== MÉTODOS PRIVADOS PARA EXCEL CON DISEÑO MEJORADO =====

  private applyEnhancedExcelStyles(ws: XLSX.WorkSheet, config: ExportConfig): void {
    const range = XLSX.utils.decode_range(ws['!ref']!);
    
    // Estilo para el título principal mejorado
    if (ws['A1']) {
      ws['A1'].s = {
        font: { bold: true, sz: 18, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "141A2F" } },
        alignment: { horizontal: "center", vertical: "center", wrapText: false },
        border: this.createBorder("141A2F", "medium")
      };
    }
    
    // Estilo para el subtítulo
    if (ws['A2']) {
      ws['A2'].s = {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "232D4B" } }, // Azul un poco más claro
        alignment: { horizontal: "center", vertical: "center" },
        border: this.createBorder("232D4B", "thin")
      };
    }
    
    // Estilos para separadores decorativos
    if (ws['A4']) {
      ws['A4'].s = {
        font: { bold: true, sz: 12, color: { rgb: "D6B68A" } },
        fill: { fgColor: { rgb: "F8F9FA" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
    
    // Estilos para encabezado de información
    if (ws['A5']) {
      ws['A5'].s = {
        font: { bold: true, sz: 12, color: { rgb: "141A2F" } },
        fill: { fgColor: { rgb: "EAD4B6" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: this.createBorder("D6B68A", "thin")
      };
    }
    
    // Estilos para información del reporte con iconos
    const infoStartRow = 7;
    const infoEndRow = this.calculateInfoEndRow(config);
    
    for (let row = infoStartRow; row <= infoEndRow; row++) {
      const cellRef = `A${row}`;
      if (ws[cellRef]) {
        const isEvenRow = (row - infoStartRow) % 2 === 0;
        ws[cellRef].s = {
          font: { bold: false, sz: 11, color: { rgb: "141A2F" } },
          fill: { fgColor: { rgb: isEvenRow ? "F8F9FA" : "FFFFFF" } },
          alignment: { horizontal: "left", vertical: "center", indent: 1 },
          border: this.createBorder("E5E7EB", "thin")
        };
      }
    }
    
    // Localizar fila de encabezados de tabla
    const headerRowIndex = infoEndRow + 3;
    
    // Estilos para encabezados de tabla mejorados
    for (let col = 0; col < config.columns.length; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: headerRowIndex, c: col });
      if (ws[cellRef]) {
        ws[cellRef].s = {
          font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "141A2F" } },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: this.createBorder("FFFFFF", "medium")
        };
      }
    }
    
    // Estilos para datos con mejoras visuales
    for (let row = headerRowIndex + 1; row <= range.e.r; row++) {
      for (let col = 0; col < config.columns.length; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (ws[cellRef]) {
          const isEvenRow = (row - headerRowIndex - 1) % 2 === 0;
          const column = config.columns[col];
          
          ws[cellRef].s = {
            font: { sz: 10, color: { rgb: "141A2F" } },
            fill: { fgColor: { rgb: isEvenRow ? "FFFFFF" : "F8F9FA" } },
            alignment: { 
              horizontal: this.getAlignmentForFormat(column.format, column.align), 
              vertical: "center",
              wrapText: column.format === 'text'
            },
            border: this.createBorder("E5E7EB", "thin"),
            numFmt: this.getNumberFormatForColumn(column.format)
          };
        }
      }
    }
    
    // Configurar anchos de columnas inteligentes
    ws['!cols'] = config.columns.map(col => ({ 
      wch: this.calculateColumnWidth(col) 
    }));
    
    // Fusionar celdas mejorado
    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: config.columns.length - 1 } }, // Título principal
      { s: { r: 1, c: 0 }, e: { r: 1, c: config.columns.length - 1 } }, // Subtítulo
      { s: { r: 3, c: 0 }, e: { r: 3, c: config.columns.length - 1 } }, // Separador
      { s: { r: 4, c: 0 }, e: { r: 4, c: config.columns.length - 1 } }, // Info header
      { s: { r: 5, c: 0 }, e: { r: 5, c: config.columns.length - 1 } }  // Separador info
    ];
    
    // Fusionar celdas de información
    for (let row = infoStartRow - 1; row < headerRowIndex - 1; row++) {
      if (row !== 2 && row !== infoEndRow + 1) { // No fusionar filas vacías
        merges.push({ s: { r: row, c: 0 }, e: { r: row, c: config.columns.length - 1 } });
      }
    }
    
    ws['!merges'] = merges;
  }

  // ===== MÉTODOS PRIVADOS PARA PDF CON DISEÑO MEJORADO =====

  private async createEnhancedPDFHeader(doc: jsPDF, config: ExportConfig, pageWidth: number): Promise<void> {
    const headerHeight = this.STYLES.spacing.headerHeight;
    
    // Fondo azul principal
    doc.setFillColor(...this.COLORS.primary);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    
    // Franja dorada superior
    doc.setFillColor(...this.COLORS.secondary);
    doc.rect(0, 0, pageWidth, 3, 'F');
    
    // Franja dorada inferior del header
    doc.setFillColor(...this.COLORS.secondary);
    doc.rect(0, headerHeight - 3, pageWidth, 3, 'F');
    
    // Área del logo mejorada
    doc.setFillColor(...this.COLORS.secondaryUltraLight);
    doc.rect(pageWidth - 55, 10, 40, 35, 'F');
    
    // Borde del logo
    doc.setDrawColor(...this.COLORS.secondary);
    doc.setLineWidth(1);
    doc.rect(pageWidth - 55, 10, 40, 35, 'S');
    
    // Texto del logo mejorado
    doc.setTextColor(...this.COLORS.primary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('LA ROCA', pageWidth - 35, 24, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Excellence', pageWidth - 35, 32, { align: 'center' });
    doc.text('& Quality', pageWidth - 35, 38, { align: 'center' });
    
    // Información de la empresa
    const companyName = config.metadata?.company || 'LA ROCA';
    const reportType = config.metadata?.reportType || 'INFORME EJECUTIVO';
    
    // Título principal mejorado
    doc.setTextColor(...this.COLORS.white);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 20, 20);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(reportType, 20, 28);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(config.title, 20, 38);
    
    // Líneas decorativas mejoradas
    doc.setDrawColor(...this.COLORS.secondary);
    doc.setLineWidth(2);
    doc.line(20, 42, pageWidth - 65, 42);
    
    doc.setLineWidth(1);
    doc.line(20, 44, pageWidth - 65, 44);
  }

  private createEnhancedPDFInfo(doc: jsPDF, config: ExportConfig, pageWidth: number): void {
    const startY = this.STYLES.spacing.headerHeight;
    const infoHeight = this.STYLES.spacing.infoHeight;
    
    // Fondo de información
    doc.setFillColor(...this.COLORS.lightGray);
    doc.rect(0, startY, pageWidth, infoHeight, 'F');
    
    // Borde superior dorado
    doc.setFillColor(...this.COLORS.secondaryLight);
    doc.rect(0, startY, pageWidth, 2, 'F');
    
    // Marco decorativo
    doc.setDrawColor(...this.COLORS.mediumGray);
    doc.setLineWidth(0.5);
    doc.rect(10, startY + 5, pageWidth - 20, infoHeight - 10, 'S');
    
    // Información del reporte en diseño mejorado
    doc.setTextColor(...this.COLORS.primary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    // Columna izquierda
    doc.text('📊 DETALLES DEL REPORTE', 15, startY + 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`📅 Fecha: ${this.getFechaCompleta()}`, 15, startY + 18);
    doc.text(`📈 Registros: ${config.data.length.toLocaleString('es-ES')} elementos`, 15, startY + 23);
    doc.text(`⏰ Hora: ${new Date().toLocaleTimeString('es-ES')}`, 15, startY + 28);
    
    // Columna central
    const centerX = pageWidth / 2 - 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('👤 INFORMACIÓN DEL USUARIO', centerX, startY + 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Usuario: ${config.metadata?.user || 'Sistema'}`, centerX, startY + 18);
    
    if (config.metadata?.department) {
      doc.text(`🏢 Módulo: ${config.metadata.department}`, centerX, startY + 23);
    }
    
    // Columna derecha
    const rightX = pageWidth - 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('🔒 CLASIFICACIÓN', rightX, startY + 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Interno', rightX, startY + 18);
    doc.text('Confidencial', rightX, startY + 23);
    doc.text(`Cols: ${config.columns.length}`, rightX, startY + 28);
  }

  private createEnhancedPDFTable(doc: jsPDF, config: ExportConfig): void {
    const columns = config.columns.map(col => ({
      header: col.header,
      dataKey: col.key
    }));
    
    const body = config.data.map(item => {
      const row: any = {};
      config.columns.forEach(col => {
        row[col.key] = this.formatCellValue(item[col.key], col.format);
      });
      return row;
    });
    
    const startY = this.STYLES.spacing.headerHeight + this.STYLES.spacing.infoHeight + 5;
    
    doc.autoTable({
      columns: columns,
      body: body,
      startY: startY,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: { top: 3, right: 2, bottom: 3, left: 2 },
        textColor: this.COLORS.primary,
        lineColor: this.COLORS.mediumGray,
        lineWidth: 0.2,
        font: 'helvetica',
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: this.COLORS.primary,
        textColor: this.COLORS.white,
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        lineColor: this.COLORS.white,
        lineWidth: 0.5,
        cellPadding: { top: 4, right: 2, bottom: 4, left: 2 }
      },
      bodyStyles: {
        alternateRowStyles: {
          fillColor: this.COLORS.lightGray
        }
      },
      columnStyles: this.getEnhancedColumnStyles(config.columns),
      margin: { left: this.STYLES.spacing.marginX, right: this.STYLES.spacing.marginX },
      tableWidth: 'auto',
      didDrawPage: (data: any) => {
        this.addEnhancedPDFFooter(doc, data.pageNumber, data.pageCount || 1, config);
      }
    });
  }

  private createManualEnhancedPDFTable(doc: jsPDF, config: ExportConfig, startY: number): void {
    let yPosition = startY;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    const totalWidth = pageWidth - (this.STYLES.spacing.marginX * 2);
    const colWidth = totalWidth / config.columns.length;
    
    // Encabezados con estilo profesional mejorado
    doc.setFillColor(...this.COLORS.primary);
    doc.rect(this.STYLES.spacing.marginX, yPosition - 8, totalWidth, 12, 'F');
    
    doc.setTextColor(...this.COLORS.white);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    config.columns.forEach((col, index) => {
      const x = this.STYLES.spacing.marginX + (index * colWidth) + 3;
      const text = col.header.length > 15 ? col.header.substring(0, 15) + '...' : col.header;
      doc.text(text, x, yPosition - 1);
    });
    
    yPosition += 8;
    
    // Datos con alternancia de colores mejorada
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    config.data.forEach((item, index) => {
      if (yPosition > pageHeight - 50) {
        this.addEnhancedPDFFooter(doc, 1, 1, config);
        doc.addPage();
        yPosition = 30;
      }
      
      if (index % 2 === 0) {
        doc.setFillColor(...this.COLORS.lightGray);
        doc.rect(this.STYLES.spacing.marginX, yPosition - 4, totalWidth, 10, 'F');
      }
      
      doc.setTextColor(...this.COLORS.primary);
      
      config.columns.forEach((col, colIndex) => {
        const x = this.STYLES.spacing.marginX + (colIndex * colWidth) + 3;
        const value = this.formatCellValue(item[col.key], col.format);
        const text = String(value).length > 25 ? String(value).substring(0, 25) + '...' : String(value);
        doc.text(text, x, yPosition + 2);
      });
      
      yPosition += 10;
    });
    
    this.addEnhancedPDFFooter(doc, 1, 1, config);
  }

  private addEnhancedPDFFooter(doc: jsPDF, pageNumber: number, totalPages: number, config: ExportConfig): void {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const footerHeight = this.STYLES.spacing.footerHeight;
    
    // Fondo del pie de página
    doc.setFillColor(...this.COLORS.primary);
    doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
    
    // Franja dorada superior del footer
    doc.setFillColor(...this.COLORS.secondary);
    doc.rect(0, pageHeight - footerHeight, pageWidth, 2, 'F');
    
    // Información del pie en tres secciones
    doc.setTextColor(...this.COLORS.white);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    // Sección izquierda
    const leftText = `📄 Página ${pageNumber} de ${totalPages}`;
    doc.text(leftText, 15, pageHeight - 8);
    
    // Sección central
    const centerText = `${config.metadata?.company || 'LA ROCA'} - Sistema de Gestión Empresarial`;
    doc.text(centerText, pageWidth / 2, pageHeight - 12, { align: 'center' });
    
    const confidentialText = '🔒 Documento Confidencial - Uso Interno';
    doc.text(confidentialText, pageWidth / 2, pageHeight - 5, { align: 'center' });
    
    // Sección derecha
    const rightText = `⏰ ${new Date().toLocaleString('es-ES', { 
      timeZone: 'America/Tegucigalpa',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    doc.text(rightText, pageWidth - 15, pageHeight - 8, { align: 'right' });
  }

  private exportEnhancedBasicPDF(config: ExportConfig): { success: boolean; message: string } {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Header básico pero profesional mejorado
      doc.setFillColor(...this.COLORS.primary);
      doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
      
      doc.setFillColor(...this.COLORS.secondary);
      doc.rect(0, 0, doc.internal.pageSize.width, 3, 'F');
      
      doc.setTextColor(...this.COLORS.white);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(config.title, 15, 18);
      
      doc.setFontSize(10);
      doc.text(`Generado: ${this.getFechaCompleta()}`, 15, 25);
      
      this.createManualEnhancedPDFTable(doc, config, 40);
      
      const nombreArchivo = `${config.filename}_${this.getFileDate()}.pdf`;
      doc.save(nombreArchivo);
      
      return { success: true, message: 'Archivo PDF exportado (versión básica profesional mejorada)' };
      
    } catch (error) {
      console.error('Error en PDF básico:', error);
      return { success: false, message: 'Error crítico al generar PDF' };
    }
  }

  // ===== MÉTODOS DE UTILIDAD MEJORADOS =====

  private getEnhancedColumnStyles(columns: ExportColumn[]): any {
    const styles: any = {};
    columns.forEach(col => {
      styles[col.key] = {
        halign: this.getAlignmentForFormat(col.format, col.align),
        cellWidth: this.calculatePDFColumnWidth(col),
        textColor: this.COLORS.primary,
        fontSize: 8,
        fontStyle: col.format === 'number' || col.format === 'currency' ? 'normal' : 'normal'
      };
    });
    return styles;
  }

  private createBorder(color: string, style: string): any {
    return {
      top: { style: style, color: { rgb: color } },
      bottom: { style: style, color: { rgb: color } },
      left: { style: style, color: { rgb: color } },
      right: { style: style, color: { rgb: color } }
    };
  }

  private calculateInfoEndRow(config: ExportConfig): number {
    let endRow = 12; // Base: separador + info header + separador + fecha + total + usuario + confidencial
    if (config.metadata?.department) endRow++;
    if (config.metadata?.additionalInfo) endRow++;
    return endRow;
  }

  private calculateColumnWidth(col: ExportColumn): number {
    if (col.width) return col.width;
    
    switch (col.format) {
      case 'date': return 18;
      case 'currency': return 15;
      case 'number': return 12;
      case 'percentage': return 10;
      default: return Math.max(col.header.length + 5, 20);
    }
  }

  private calculatePDFColumnWidth(col: ExportColumn): number | string {
    if (col.width) return col.width;
    
    switch (col.format) {
      case 'date': return 25;
      case 'currency': return 20;
      case 'number': return 15;
      case 'percentage': return 15;
      default: return 'auto';
    }
  }

  private getAlignmentForFormat(format?: string, defaultAlign?: string): string {
    if (defaultAlign) return defaultAlign;
    
    switch (format) {
      case 'number':
      case 'currency':
      case 'percentage':
        return 'right';
      case 'date':
        return 'center';
      default:
        return 'left';
    }
  }

  private getNumberFormatForColumn(format?: string): string {
    switch (format) {
      case 'currency': return '#,##0.00"$"';
      case 'number': return '#,##0.00';
      case 'percentage': return '0.00%';
      case 'date': return 'dd/mm/yyyy';
      default: return 'General';
    }
  }

  private formatCellValue(value: any, format?: string): string {
    if (!value && value !== 0) return '';
    
    switch (format) {
      case 'currency':
        const num = parseFloat(value);
        return isNaN(num) ? value : `L. ${num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      
      case 'number':
        const number = parseFloat(value);
        return isNaN(number) ? value : number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      
      case 'percentage':
        const percent = parseFloat(value);
        return isNaN(percent) ? value : `${(percent * 100).toFixed(2)}%`;
      
      case 'date':
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toLocaleDateString('es-ES');
      
      default:
        return this.cleanText(value);
    }
  }

  private centerText(text: string, width: number): string {
    const textLength = text.length;
    if (textLength >= width) return text.substring(0, width);
    
    const padding = Math.floor((width - textLength) / 2);
    return ' '.repeat(padding) + text + ' '.repeat(width - textLength - padding);
  }

  private cleanText(text: any): string {
    if (!text && text !== 0) return '';
    
    return String(text)
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-.,;:()\[\]áéíóúñüÁÉÍÓÚÑÜ]/g, '') // Incluir caracteres especiales del español
      .trim()
      .substring(0, 200);
  }

  private escapeCSV(value: any): string {
    if (!value && value !== 0) return '';
    
    let stringValue = String(value)
      .replace(/[\r\n]/g, ' ')
      .replace(/[^\w\s\-.,;:()\[\]áéíóúñüÁÉÍÓÚÑÜ]/g, ''); // Incluir caracteres especiales del español
    
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      stringValue = `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  }

  private getFechaCompleta(): string {
    return new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Tegucigalpa',
      weekday: 'long'
    });
  }

  private getFileDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  }

  private sanitizeSheetName(name: string): string {
    return name
      .replace(/[\\\/\?\*\[\]:]/g, '')
      .replace(/[^\w\s\-áéíóúñüÁÉÍÓÚÑÜ]/g, '') // Incluir caracteres especiales del español
      .substring(0, 31);
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
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

  // ===== MÉTODOS PÚBLICOS ADICIONALES PARA CONFIGURACIÓN =====

  /**
   * Permite configurar colores personalizados manteniendo la estructura
   */
  public setCustomColors(customColors: Partial<typeof this.COLORS>): void {
    Object.assign(this.COLORS, customColors);
  }

  /**
   * Permite configurar estilos personalizados
   */
  public setCustomStyles(customStyles: Partial<typeof this.STYLES>): void {
    Object.assign(this.STYLES, customStyles);
  }

  /**
   * Exporta múltiples hojas en un solo archivo Excel
   */
  async exportMultiSheetExcel(configs: ExportConfig[]): Promise<{ success: boolean; message: string }> {
    try {
      if (!configs.length) {
        return { success: false, message: 'No hay configuraciones para exportar' };
      }

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      
      for (const config of configs) {
        if (config.data && config.data.length > 0) {
          const companyName = config.metadata?.company || 'LA ROCA';
          const reportType = config.metadata?.reportType || 'INFORME EJECUTIVO';
          
          const datosConEncabezado = [
            [`${companyName} - ${reportType}`],
            [`${config.title.toUpperCase()}`],
            [],
            [`📊 Fecha: ${this.getFechaCompleta()}`],
            [`📈 Registros: ${config.data.length.toLocaleString('es-ES')}`],
            [`👤 Usuario: ${config.metadata?.user || 'Sistema'}`],
            [],
            config.columns.map(col => col.header),
            ...config.data.map(item => 
              config.columns.map(col => this.formatCellValue(item[col.key], col.format))
            )
          ];

          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(datosConEncabezado);
          this.applyEnhancedExcelStyles(ws, config);
          
          XLSX.utils.book_append_sheet(wb, ws, this.sanitizeSheetName(config.title));
        }
      }
      
      const nombreArchivo = `Reporte_Consolidado_${this.getFileDate()}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
      
      return { success: true, message: `Archivo Excel con ${configs.length} hojas exportado exitosamente` };
      
    } catch (error) {
      console.error('Error al exportar Excel multi-hoja:', error);
      return { success: false, message: 'Error al exportar el archivo Excel consolidado' };
    }
  }

  /**
   * Obtiene una vista previa de cómo se verá el reporte
   */
  public getExportPreview(config: ExportConfig): {
    estimatedSize: string;
    columns: number;
    rows: number;
    estimatedPages: number;
    filenameSuggestion: string;
  } {
    const rows = config.data.length;
    const columns = config.columns.length;
    const estimatedSize = `${Math.round((rows * columns * 50) / 1024)} KB`;
    const estimatedPages = Math.ceil(rows / 35); // Aproximadamente 35 filas por página
    const filenameSuggestion = `${config.filename}_${this.getFileDate()}`;

    return {
      estimatedSize,
      columns,
      rows,
      estimatedPages,
      filenameSuggestion
    };
  }
}