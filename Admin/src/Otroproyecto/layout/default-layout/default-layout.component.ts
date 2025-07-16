import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { HttpClientModule } from '@angular/common/http';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  INavData
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { PantallasService } from '../../services/pantallas.service';
import { Pantalla } from '../../models/pantalla.model';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
    HttpClientModule
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems: INavData[] = [];

  constructor(private pantallasService: PantallasService) {}

  ngOnInit(): void {
    this.cargarMenuPorRol();
  }

  /**
   * Carga el menú según el rol del usuario
   */
  cargarMenuPorRol(): void {
    // Obtener el ID del rol del usuario desde localStorage
    const roleId = localStorage.getItem('roleId');
    const esAdmin = localStorage.getItem('usuarioEsAdmin') === 'true';
    const esEmpleado = localStorage.getItem('usuarioEsEmpleado') === 'true';
    
    if (esAdmin) {
      // Si el usuario es administrador, cargar el menú para administradores
      console.log('Usuario administrador, cargando menú de administrador');
      // Crear un menú personalizado para administradores (sin Mi Casillero)
      this.construirMenuAdmin();
    } else if (roleId) {
      console.log('Cargando menú para el rol:', roleId);
      // Cargar las pantallas asignadas al rol
      this.pantallasService.obtenerPantallasAsignadas(Number(roleId)).subscribe({
        next: (response) => {
          if (response && response.success && response.data) {
            console.log('Pantallas asignadas recibidas:', response.data);
            // Construir el menú a partir de las pantallas asignadas
            this.construirMenu(response.data);
            
            // Guardar las pantallas permitidas en localStorage para referencia futura
            const nombresPantallas = response.data.map(p => p.pant_Descripcion);
            localStorage.setItem('pantallasPermitidas', JSON.stringify(nombresPantallas));
          } else {
            console.error('No se pudieron cargar las pantallas asignadas');
            // Cargar el menú por defecto si no hay pantallas asignadas
            this.navItems = [...navItems];
          }
        },
        error: (error) => {
          console.error('Error al cargar las pantallas asignadas:', error);
          // Cargar el menú por defecto en caso de error
          this.navItems = [...navItems];
        }
      });
    } else {
      // Si no hay rol, cargar el menú por defecto
      console.log('No se encontró información de rol, cargando menú por defecto');
      this.navItems = [...navItems];
    }
  }

  /**
   * Construye el menú a partir de las pantallas asignadas
   * @param pantallas Lista de pantallas asignadas al rol
   */
  construirMenu(pantallas: Pantalla[]): void {
    // Inicializar el menú con elementos básicos
    const menuItems: INavData[] = [];
    
    const esEmpleado = localStorage.getItem('usuarioEsEmpleado') === 'true';
    const esAdmin = localStorage.getItem('usuarioEsAdmin') === 'true';
    const esCliente = !esEmpleado && !esAdmin;
    
    // Agregar opciones según el tipo de usuario
    if (esEmpleado || esAdmin) {
      // Para administradores y empleados
      menuItems.push({
        name: 'Inicio',
        url: '/dashboard',
        iconComponent: { name: 'cil-home' },
      });
    } else {
      // Para clientes
      menuItems.push({
        name: 'Mi Casillero',
        url: '/dashboard-cliente',
        iconComponent: { name: 'cil-inbox' },
      });
      
      menuItems.push({
        name: 'Mis Paquetes',
        url: '/cliente-paquetes',
        iconComponent: { name: 'cil-gift' },
      });
    }
    
    // Agregar calculadora de precios para todos los usuarios
    menuItems.push({
      name: 'Calculadora de Precios',
      url: '/calculadora-precios',
      iconComponent: { name: 'cil-calculator' },
    });

    // Agrupar las pantallas por categoría
    const pantallasPorCategoria = this.agruparPantallasPorCategoria(pantallas);

    // Agregar cada categoría al menú
    Object.keys(pantallasPorCategoria).forEach(categoria => {
      // Solo agregar la categoría si tiene pantallas
      if (pantallasPorCategoria[categoria].length > 0) {
        // Agregar el título de la categoría
        menuItems.push({
          title: true,
          name: categoria
        });

        // Crear el elemento de menú principal para la categoría
        const elementoCategoria: INavData = {
          name: categoria,
          url: `/${categoria.toLowerCase()}`,
          iconComponent: { name: this.obtenerIconoCategoria(categoria) },
          linkProps: {
            routerLinkActive: 'c-active',
            routerLinkActiveOptions: { exact: false }
          },
          children: []
        };

        // Agregar las pantallas como elementos hijos
        pantallasPorCategoria[categoria].forEach(pantalla => {
          elementoCategoria.children?.push({
            name: pantalla.pant_Descripcion,
            url: pantalla.pant_Ruta || `/${pantalla.pant_Descripcion.toLowerCase().replace(/ /g, '')}/list`,
            iconComponent: { name: pantalla.pant_Icono }
          });
        });

        // Agregar la categoría al menú
        menuItems.push(elementoCategoria);
      }
    });

    // Actualizar el menú
    this.navItems = menuItems;
    console.log('Menú construido:', this.navItems);
  }

  /**
   * Agrupa las pantallas por categoría
   * @param pantallas Lista de pantallas asignadas al rol
   * @returns Objeto con las pantallas agrupadas por categoría
   */
  agruparPantallasPorCategoria(pantallas: Pantalla[]): { [key: string]: Pantalla[] } {
    // Definir las categorías principales del sistema
    const categorias = ['General', 'Casillero', 'Acceso'];
    
    // Crear un mapa para agrupar las pantallas por categoría
    const pantallasPorCategoria: { [key: string]: Pantalla[] } = {};
    
    // Inicializar las categorías
    categorias.forEach(categoria => {
      pantallasPorCategoria[categoria] = [];
    });
    
    // Distribuir las pantallas en las categorías
    pantallas.forEach(pantalla => {
      // Determinar la categoría según la descripción o ruta de la pantalla
      let categoria = 'General';
      
      const descripcion = pantalla.pant_Descripcion.toLowerCase();
      
      if (descripcion.includes('usuario') || descripcion.includes('rol')) {
        categoria = 'Acceso';
      } else if (descripcion.includes('paquete') || descripcion.includes('casillero') || 
                descripcion.includes('despacho') || descripcion.includes('transporte') || 
                descripcion.includes('vehiculo') || descripcion.includes('cargo') || 
                descripcion.includes('reempaquetado')) {
        categoria = 'Casillero';
      }
      
      // Agregar la pantalla a la categoría correspondiente
      if (pantallasPorCategoria[categoria]) {
        pantallasPorCategoria[categoria].push(pantalla);
      } else {
        pantallasPorCategoria[categoria] = [pantalla];
      }
    });
    
    return pantallasPorCategoria;
  }

  /**
   * Obtiene el icono correspondiente a una categoría
   * @param categoria Nombre de la categoría
   * @returns Nombre del icono para la categoría
   */
  obtenerIconoCategoria(categoria: string): string {
    switch (categoria) {
      case 'General':
        return 'cil-settings';
      case 'Casillero':
        return 'cil-inbox';
      case 'Acceso':
        return 'cil-lock-locked';
      default:
        return 'cil-settings';
    }
  }
  
  /**
   * Construye un menú personalizado para administradores
   * Este menú no incluye las opciones exclusivas de clientes
   */
  construirMenuAdmin(): void {
    // Crear una copia del menú predeterminado
    const menuCompleto = [...navItems];
    
    // Filtrar el menú para eliminar las opciones exclusivas de clientes
    const menuFiltrado = menuCompleto.filter(item => 
      // Eliminar Mi Casillero
      !(item.name === 'Mi Casillero' && item.url === '/dashboard-cliente') &&
      // Eliminar Mis Paquetes
      !(item.name === 'Mis Paquetes' && item.url === '/cliente-paquetes')
      // Mantener la calculadora de precios para ambos tipos de usuarios
    );
    
    // Asignar el menú filtrado
    this.navItems = menuFiltrado;
    console.log('Menú de administrador construido:', this.navItems);
  }
}
