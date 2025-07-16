import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Inicio',
    url: '/dashboard',
    iconComponent: { name: 'cil-home' },
  },
  {
    name: 'Mi Casillero',
    url: '/dashboard-cliente',
    iconComponent: { name: 'cil-inbox' },
  },
  {
    name: 'Mis Paquetes',
    url: '/cliente-paquetes',
    iconComponent: { name: 'cil-gift' },
  },
  {
    name: 'Calculadora de Precios',
    url: '/calculadora-precios',
    iconComponent: { name: 'cil-calculator' },
  },
  //ESQUEMA GENERAL
 
  {
    name: 'General',
    title: true
  },
  {
    name: 'General',
    url: '/general',
    iconComponent: { name: 'cil-settings' },
    linkProps: {
      routerLinkActive: 'c-active',
      routerLinkActiveOptions: { exact: false }
    },
    children: [
      {
        name: 'Estados Civiles',
        url: '/estadosciviles/list',
        iconComponent: { name: 'cil-user-follow' }
      },
      {
        name: 'Clientes',
        url: '/clientes/list',
        iconComponent: { name: 'cil-people' }
      },
      {
        name: 'Departamentos',
        url: '/departamentos/list',
        iconComponent: { name: 'cil-map' }
      },
      {
        name: 'Municipios',
        url: '/municipios/list',
        iconComponent: { name: 'cil-location-pin' }
      },
      {
        name: 'Direcciones',
        url: '/direcciones/list',
        iconComponent: { name: 'cil-address-book' }
      },
      {
        name: 'Direcciones Por Cliente',
        url: '/direccionesporcliente/list',
        iconComponent: { name: 'cil-contact' }
      }

    ]
  },

  //ESQUEMA CASILLERO
  {
    title: true,
    name: 'Casillero',
  },
  {
    name: 'Casillero',
    url: '/casillero',
    iconComponent: { name: 'cil-inbox' },
    linkProps: {
      routerLinkActive: 'c-active',
      routerLinkActiveOptions: { exact: false }
    },
    children: [
      {
        name: 'Paquetes',
        url: '/paquetes/list',
        iconComponent: { name: 'cil-gift' }
      },
      {
        name: 'Casilleros',
        url: '/casilleros/list',
        iconComponent: { name: 'cil-storage' }
      },
      {
        name: 'Recepcion Paquetes',
        url: '/recepcionpaquetes/list',
        iconComponent: { name: 'cilInbox' }
      },
      {
        name: 'Reempaquetados',
        url: '/reempaquetados/list',
        iconComponent: { name: 'cil-recycle' }
      },
      {
        name: 'Despachos',
        url: '/despachos/list',
        iconComponent: { name: 'cil-truck' }
      },
      {
        name: 'Cargos',
        url: '/cargos/list',
        iconComponent: { name: 'cil-dollar' }
      },
      {
        name: 'Empleados',
        url: '/empleados/list',
        iconComponent: { name: 'cil-people' }
      },
      {
        name: 'Transportes',
        url: '/transportes/list',
        iconComponent: { name: 'cil-truck' }
      },
      {
        name: 'Vehiculos',
        url: '/vehiculos/list',
        iconComponent: { name: 'cil-garage' }
      },
      {
        name: 'Precios',
        url: '/precios/list',
        iconComponent: { name: 'cil-money' }
      }
    ]
  },

  //ESQUEMA DE ACCESO
  {
    title: true,
    name: 'Acceso',
  },
  {
    name: 'Acceso',
    url: '/acceso',
    iconComponent: { name: 'cil-lock-locked' },
    linkProps: {
      routerLinkActive: 'c-active',
      routerLinkActiveOptions: { exact: false }
    },
    children: [
      {
        name: 'Usuarios',
        url: '/usuarios/list',
        iconComponent: { name: 'cil-user' }
      },
      {
        name: 'Roles',
        url: '/roles/list',
        iconComponent: { name: 'cil-shield-alt' }
      },
      
    ]
  },

  //REPORTES
  {
    title: true,
    name: 'Reportes',
  },
  {
    name: 'Reportes',
    url: '/reportes',
    iconComponent: { name: 'cil-book' },
    linkProps: {
      routerLinkActive: 'c-active',
      routerLinkActiveOptions: { exact: false }
    },
    children: [
      {
        name: 'Reporte de Recepciones',
        url: '/reportes/reportes',
        iconComponent: { name: 'cil-layers' }
      },
      {
        name: 'Reporte de Frecuencia de Clientes',
        url: '/reportes/clientes',
        iconComponent: { name: 'cil-layers' }
      },
      {
        name: 'Reporte de Productividad de Empleados',
        url: '/reportes/empleados',
        iconComponent: { name: 'cil-layers' }
      },
    ]
  }
];
