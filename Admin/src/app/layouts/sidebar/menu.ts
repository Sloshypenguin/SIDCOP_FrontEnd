import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: 'MENUITEMS.MENU.TEXT',
        isTitle: true
    },
    {
        id: 2,
        label: 'MENUITEMS.DASHBOARD.TEXT',
        icon: 'ph-gauge',
        subItems: [
            {
                id: 5,
                label: 'MENUITEMS.DASHBOARD.LIST.ECOMMERCE',
                link: '/',
                parentId: 2
            },
        ]
    },
    {
        id: 6,
        label: 'MENUITEMS.ACCESO.TEXT',
        icon: 'ri-lock-line',
        subItems: [
            {
                id: 61,
                label: 'MENUITEMS.ACCESO.LIST.USUARIOS',
                link: '/acceso/usuarios',
                parentId: 6
            },
        ]
    },
    {
        id: 3,
        label: 'MENUITEMS.GENERAL.TEXT',
        icon: 'ri-apps-2-line',
        subItems: [
            {
                id: 14,
                label: 'MENUITEMS.GENERAL.LIST.ESTADOSCIVILES',
                link: '/general/estadosciviles',
                parentId: 2,
                icon: 'ri-group-line'
            },
             {
                id: 17,
                label: 'MENUITEMS.GENERAL.LIST.MODELOS',
                link: '/general/modelos',
                parentId: 2,
                icon: 'ri-group-line'
            },
            {
                id: 20,
                label: 'MENUITEMS.GENERAL.LIST.SUCURSALES',
                link: '/general/sucursales',
                parentId: 2,
                icon: 'ri-group-line'
            },
            {
                id: 15,
                label: 'MENUITEMS.GENERAL.LIST.MARCAS',
                link: '/general/marcas',
                parentId: 2,
                icon: 'ri-group-line'
            },
            {
                id: 12,
                label: 'MENUITEMS.GENERAL.LIST.DEPARTAMENTOS',
                link: '/general/departamentos',
                parentId: 2,
                icon: 'ri-group-line'
            },
            {
                id: 16,
                label: 'MENUITEMS.GENERAL.LIST.MARCASVEHICULOS',
                link: '/general/marcasvehiculos',
                parentId: 2,
                icon: 'ri-group-line'
            },
            {
                id: 18,
                label: 'MENUITEMS.GENERAL.LIST.MUNICIPIOS',
                link: '/general/municipios',
                parentId: 2,
                icon: 'ri-group-line'
            },
            {
                id: 11,
                label: 'MENUITEMS.GENERAL.LIST.COLONIAS',
                link: '/general/colonias', 
                parentId: 2,
                icon: 'ri-building-2-line'
            },    
            {
                id: 8,
                label: 'MENUITEMS.GENERAL.LIST.CANALES',
                link: '/general/canales',
                parentId: 2,
                icon: 'ri-building-2-line'
            },

            {
                id: 19,
                label: 'MENUITEMS.GENERAL.LIST.PROVEEDORES',
                link: '/general/proveedores',
                parentId: 2,
                icon: 'ri-group-line'
            },
 
            {
                id: 13,
                label: 'MENUITEMS.GENERAL.LIST.EMPLEADOS',
                link: '/general/empleados',
                parentId: 2,
                icon: 'ri-building-2-line'
            },
            {
                id: 9,
                label: 'MENUITEMS.GENERAL.LIST.CARGOS',
                link: '/general/cargos',
                parentId: 2,
                icon: 'ri-building-2-line'
            },

        ]
    },
    {
        id: 5,
        label: 'MENUITEMS.VENTAS.TEXT',
        icon: 'ri-shopping-cart-2-line',
        subItems: [

            {
                id: 37,
                label: 'MENUITEMS.VENTAS.LIST.IMPUESTOS',
                link: '/ventas/impuestos',
                parentId: 5,
                icon: 'ri-group-line'
            },
            
            {
                id: 33,
                label: 'MENUITEMS.VENTAS.LIST.CONFIGURACIONFACTURA',
                link: '/ventas/configuracion-factura',
                parentId: 5,
                icon: 'ri-group-line'
            },

            {
                id: 32,
                label: 'MENUITEMS.VENTAS.LIST.CAIS',
                link: '/ventas/CAIs',
                parentId: 5,
                icon: 'ri-group-line'
            },

            {
                id: 42,
                label: 'MENUITEMS.VENTAS.LIST.VENDEDORES',
                link: '/ventas/Vendedores',
                parentId: 5,
                icon: 'ri-group-line'
            },
            {
                id: 41,
                label: 'MENUITEMS.VENTAS.LIST.REGISTROCAIS',
                link: '/ventas/registroscais',
                parentId: 5,
                icon: 'ri-group-line'
            },

              {
                id: 40,
                label: 'MENUITEMS.VENTAS.LIST.PUNTOSEMISION',
                link: '/ventas/puntosemision',
                parentId: 5,
                icon: 'ri-group-line'
            },
            // Puedes añadir más subitems aquí según sea necesario
        ]
    },
    {
        id: 4,
        label: 'MENUITEMS.LOGISTICA.TEXT',
        icon: 'ri-apps-2-line',
        subItems: [
            {
                id: 28,
                label: 'MENUITEMS.LOGISTICA.LIST.BODEGAS',
                link: '/logistica/bodegas',
                parentId: 4,
                icon: 'ri-truck-line'
            }
            // Puedes añadir más subitems aquí según sea necesario
        ]
    },
    
    {
        id: 3,
        label: 'MENUITEMS.INVENTARIO.TEXT',
        icon: 'ri-layout-grid-fill',
        subItems: [
            {
                id: 21,
                label: 'MENUITEMS.INVENTARIO.LIST.CATEGORIAS',
                link: '/inventario/categorias',
                parentId: 3,
                icon: 'ri-truck-line'
            },
            {
                id: 27,
                label: 'MENUITEMS.INVENTARIO.LIST.SUBCATEGORIAS',
                link: '/inventario/subcategorias',
                parentId: 3,
                icon: 'ri-truck-line'
            },
            {
                id: 25,
                label: 'MENUITEMS.INVENTARIO.LIST.PRODUCTOS',
                link: '/inventario/productos',
                parentId: 3,
                icon: 'ri-truck-line'
            },
             {
                id: 22,
                label: 'MENUITEMS.INVENTARIO.LIST.DESCUENTOS',
                link: '/inventario/descuentos',
                parentId: 3,
                icon: 'ri-truck-line'
            }
            // Puedes añadir más subitems aquí según sea necesario
        ]
    },
   
    
]