import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getUserId } from 'src/app/core/utils/user-utils';

@Component({
  selector: 'app-reporte-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ReporteProductosComponent implements OnInit {
  productos: any[] = [];
  pdfUrl: SafeResourceUrl | null = null;
  cargando = false;
  configuracionEmpresa: any = null;

  // Colores del tema
  private readonly COLORES = {
    dorado: '#D6B68A',
    azulOscuro: '#141a2f',
    blanco: '#FFFFFF',
    grisClaro: '#F8F9FA',
    grisTexto: '#666666'
  };

  // Filtros
  fechaInicio: string | null = null;
  fechaFin: string | null = null;
  marcas: any[] = [];
  categorias: any[] = [];
  marcaSeleccionada: number | null = null;
  categoriaSeleccionada: number | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    this.cargando = true;
    
    // Cargar configuración de empresa
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

    // Cargar marcas y categorías para los filtros
    this.http.get<any[]>(`${environment.apiBaseUrl}/Marcas/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.marcas = data;
      },
      error: (error) => {
        console.error('Error al cargar marcas:', error);
      }
    });

    this.http.get<any[]>(`${environment.apiBaseUrl}/Categorias/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.cargando = false;
      }
    });
  }

  generarReporte() {
    this.cargando = true;
    
    // Parámetros para el SP
    const params: any = {};
    if (this.fechaInicio) params.fechaInicio = this.fechaInicio;
    if (this.fechaFin) params.fechaFin = this.fechaFin;
    if (this.marcaSeleccionada) params.marcaId = this.marcaSeleccionada;
    if (this.categoriaSeleccionada) params.categoriaId = this.categoriaSeleccionada;

    this.http.get<any[]>(`${environment.apiBaseUrl}/Reportes/ReporteDeProductos`, {
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

  private async cargarLogo(): Promise<string | null> {
    if (!this.configuracionEmpresa?.coFa_Logo) {
      console.log('No hay logo configurado');
      return null;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Importante para URLs externas
      
      img.onload = () => {
        try {
          // Crear canvas para convertir la imagen a base64
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            console.error('No se pudo obtener el contexto del canvas');
            resolve(null);
            return;
          }
          
          // Configurar tamaño del canvas manteniendo proporciones
          const maxWidth = 120;
          const maxHeight = 60;
          let { width, height } = img;
          
          // Calcular nuevas dimensiones manteniendo aspecto
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
          
          // Limpiar canvas con fondo transparente
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Dibujar imagen redimensionada
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir a base64
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
      
      // Configurar la URL de la imagen
      try {
        const logoUrl = this.configuracionEmpresa.coFa_Logo;
        console.log('Intentando cargar logo desde:', logoUrl);
        
        // Si es una URL de Cloudinary o cualquier URL externa
        if (logoUrl.startsWith('http')) {
          img.src = logoUrl;
        } 
        // Si es base64
        else if (logoUrl.startsWith('data:')) {
          img.src = logoUrl;
        } 
        // Si es solo el string base64 sin prefijo
        else {
          img.src = `data:image/png;base64,${logoUrl}`;
        }
      } catch (e) {
        console.error('Error al configurar src del logo:', e);
        resolve(null);
      }
    });
  }

async generarPDF() {
  const doc = new jsPDF('landscape');
  const fecha = new Date();
  const fechaTexto = fecha.toLocaleDateString('es-HN');
  const horaTexto = fecha.toLocaleTimeString('es-HN');

  //  Cargar el logo 
  let logoDataUrl: string | null = null;
  
  if (this.configuracionEmpresa?.coFa_Logo) {
    try {
      logoDataUrl = await this.cargarLogo();
    } catch (e) {
      console.error('Error al cargar el logo:', e);
      logoDataUrl = null;
    }
  }

  // 2. Encabezado blanco
  
  // Línea separadora en la parte inferior del encabezado
  doc.setDrawColor(this.COLORES.dorado);
  doc.setLineWidth(2);
  doc.line(20, 35, doc.internal.pageSize.width - 20, 35);

  // Posicionamiento del logo 
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', 20, 5, 30, 25);
      console.log('Logo agregado al PDF correctamente');
    } catch (e) {
      console.error('Error al agregar imagen al PDF:', e);
    }
  } else {
    console.log('No se pudo cargar el logo para el PDF');
  }

  // Nombre de la empresa y título del reporte (sobre fondo blanco)
  doc.setTextColor(this.COLORES.azulOscuro);
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  const nombreEmpresa = this.configuracionEmpresa?.coFa_NombreEmpresa || 'Nombre de Empresa';
  
  // Centrar el texto en toda la página
  const pageWidth = doc.internal.pageSize.width;
  doc.text(nombreEmpresa, pageWidth / 2, 15, { align: 'center' });
  
  // Título del reporte 
  doc.setTextColor(this.COLORES.azulOscuro); // Cambio de gris a azul oscuro
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('REPORTE DE PRODUCTOS', pageWidth / 2, 27, { align: 'center' });

  // 3. Filtros aplicados (si existen) - ajustado para encabezado compacto
  let yPos = 45; // Posición inicial para filtros, más cerca del encabezado
  const hasFilters = this.fechaInicio || this.fechaFin || this.marcaSeleccionada || this.categoriaSeleccionada;
  
  if (hasFilters) {
    doc.setTextColor(this.COLORES.grisTexto);
    doc.setFontSize(10);
    doc.text('Filtros aplicados:', 20, yPos);
    yPos += 6;

    if (this.fechaInicio) {
      doc.text(`• Desde: ${this.fechaInicio}`, 25, yPos);
      yPos += 6;
    }
    
    if (this.fechaFin) {
      doc.text(`• Hasta: ${this.fechaFin}`, 25, yPos);
      yPos += 6;
    }
    
    if (this.marcaSeleccionada) {
      const marca = this.marcas.find(m => m.marc_Id === this.marcaSeleccionada);
      doc.text(`• Marca: ${marca?.marc_Descripcion || 'N/A'}`, 25, yPos);
      yPos += 6;
    }
    
    if (this.categoriaSeleccionada) {
      const categoria = this.categorias.find(c => c.cate_Id === this.categoriaSeleccionada);
      doc.text(`• Categoría: ${categoria?.cate_Descripcion || 'N/A'}`, 25, yPos);
      yPos += 6;
    }
    
    yPos += 10; // Espacio adicional después de los filtros
  }

  // Configuración de la tabla con paginación automática
  autoTable(doc, {
    startY: yPos,
    head: [
      [
        { content: '#', styles: { halign: 'center', cellWidth: 15 } },
        { content: 'Código', styles: { cellWidth: 25 } },
        { content: 'Descripción', styles: { cellWidth: 60 } },
        { content: 'Marca', styles: { cellWidth: 30 } },
        { content: 'Categoría', styles: { cellWidth: 30 } },
        { content: 'Subcategoría', styles: { cellWidth: 35 } },
        { content: 'Precio', styles: { halign: 'right', cellWidth: 25 } },
        { content: 'Costo', styles: { halign: 'right', cellWidth: 25 } },
        { content: 'Impuesto', styles: { halign: 'center', cellWidth: 20 } }
      ]
    ],
    body: this.productos.map((p, index) => [
      { content: (index + 1).toString(), styles: { halign: 'center' } },
      p.prod_Codigo || 'N/A',
      this.truncateText(p.prod_Descripcion || '', 40),
      p.marc_Descripcion || 'N/A',
      p.cate_Descripcion || 'N/A',
      p.subc_Descripcion || 'N/A',
      { content: `L. ${this.formatearNumero(p.prod_PrecioUnitario)}`, styles: { halign: 'right' } },
      { content: `L. ${this.formatearNumero(p.prod_CostoTotal)}`, styles: { halign: 'right' } },
      { content: p.prod_PagaImpuesto ? 'Sí' : 'No', styles: { halign: 'center' } }
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle'
    },
    headStyles: {
      fillColor: this.COLORES.azulOscuro,
      textColor: this.COLORES.dorado,
      fontStyle: 'bold',
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    margin: { left: 15, right: 15, bottom: 30 },
    tableWidth: 'auto',
    showHead: 'everyPage',
    pageBreak: 'auto',
    didDrawPage: (data) => {
      // Pie de página en cada página
      doc.setFontSize(8);
      doc.setTextColor(this.COLORES.grisTexto);
      
      // Información del pie de página 
      const totalPages = doc.getNumberOfPages();
      
      // Lado izquierdo: Usuario y fecha/hora
      const usuarioCreacion = this.productos[0]?.usuarioCreacion || 'N/A';
      doc.text(`Generado por: ${getUserId()} - ${usuarioCreacion} | ${fechaTexto} ${horaTexto}`, 20, doc.internal.pageSize.height - 12);
      
      // Lado derecho: Paginación con formato x/y
      doc.text(`Página ${data.pageNumber}/${totalPages}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 12, { align: 'right' });
    }
  });

  // 6. Resumen final (solo si hay espacio)
  const finalY = (doc as any).lastAutoTable.finalY;
  if (finalY < doc.internal.pageSize.height - 30) {
    doc.setFontSize(10);
    doc.setTextColor(this.COLORES.azulOscuro);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total de productos: ${this.productos.length}`, 20, finalY + 15);
  }

  // Generar URL para visualización
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
}

  private formatearNumero(numero: number | null | undefined): string {
    if (numero === null || numero === undefined || isNaN(numero)) {
      return '0.00';
    }
    return numero.toLocaleString('es-HN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  limpiarFiltros() {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.marcaSeleccionada = null;
    this.categoriaSeleccionada = null;
  }
}