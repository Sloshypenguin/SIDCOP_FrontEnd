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
        id: 3,
        label: 'MENUITEMS.GENERAL.TEXT',
        icon: 'ri-apps-2-line',
        subItems: [
            {
                id: 31,
                label: 'MENUITEMS.GENERAL.LIST.ESTADOSCIVILES',
                link: '/general/estadosciviles',
                parentId: 3,
                icon: 'ri-group-line'
            },
             {
                id: 32,
                label: 'MENUITEMS.GENERAL.LIST.MODELOS',
                link: '/general/modelos',
                parentId: 3,
                icon: 'ri-group-line'
            },
            {
                id: 33,
                label: 'MENUITEMS.GENERAL.LIST.SUCURSALES',
                link: '/general/sucursales',
                parentId: 3,
                icon: 'ri-group-line'
            },
            {
                id: 34,
                label: 'MENUITEMS.GENERAL.LIST.MARCAS',
                link: '/general/marcas',
                parentId: 3,
                icon: 'ri-group-line'
            },
            {
                id: 35,
                label: 'MENUITEMS.GENERAL.LIST.DEPARTAMENTOS',
                link: '/general/departamentos',
                parentId: 3,
                icon: 'ri-group-line'
            },
            {
                id: 36,
                label: 'MENUITEMS.GENERAL.LIST.MARCASVEHICULOS',
                link: '/general/marcasvehiculos',
                parentId: 3,
                icon: 'ri-group-line'
            },
            {
                id: 37,
                label: 'MENUITEMS.GENERAL.LIST.MUNICIPIOS',
                link: '/general/municipios',
                parentId: 3,
                icon: 'ri-group-line'
            },
            {
                id: 38,
                label: 'MENUITEMS.GENERAL.LIST.COLONIAS',
                link: '/general/colonias', 
                parentId: 3,
                icon: 'ri-building-2-line'
            },    
            {
                id: 39,
                label: 'MENUITEMS.GENERAL.LIST.CANALES',
                link: '/general/canales',
                parentId: 3,
                icon: 'ri-building-2-line'
            },

            {
                id: 38,
                label: 'MENUITEMS.GENERAL.LIST.PROVEEDORES',
                link: '/general/proveedores',
                parentId: 3,
                icon: 'ri-group-line'
            },
 
            {
                id: 35,
                label: 'MENUITEMS.GENERAL.LIST.EMPLEADOS',
                link: '/general/empleados',
                parentId: 3,
                icon: 'ri-building-2-line'
            },
            {
                id: 37,
                label: 'MENUITEMS.GENERAL.LIST.CARGOS',
                link: '/general/cargos',
                parentId: 3,
                icon: 'ri-building-2-line'
            },

        ]
    },
    {
        id: 4,
        label: 'MENUITEMS.VENTAS.TEXT',
        icon: 'ri-shopping-cart-2-line',
        subItems: [

            {
                id: 33,
                label: 'MENUITEMS.VENTAS.LIST.IMPUESTOS',
                link: '/ventas/impuestos',
                parentId: 4,
                icon: 'ri-group-line'
            },
            
            {
                id: 34,
                label: 'MENUITEMS.VENTAS.LIST.CONFIGURACIONFACTURA',
                link: '/ventas/configuracion-factura',
                parentId: 4,
                icon: 'ri-group-line'
            },

            {
                id: 35,
                label: 'MENUITEMS.VENTAS.LIST.CAIS',
                link: '/ventas/CAIs',
                parentId: 4,
                icon: 'ri-group-line'
            },

            {
                id: 36,
                label: 'MENUITEMS.VENTAS.LIST.VENDEDORES',
                link: '/ventas/Vendedores',
                parentId: 4,
                icon: 'ri-group-line'
            },
            // Puedes añadir más subitems aquí según sea necesario
        ]
    },
    {
        id: 5,
        label: 'MENUITEMS.LOGISTICA.TEXT',
        icon: 'ri-apps-2-line',
        subItems: [
            {
                id: 34,
                label: 'MENUITEMS.LOGISTICA.LIST.BODEGAS',
                link: '/logistica/bodegas',
                parentId: 5,
                icon: 'ri-truck-line'
            }
            // Puedes añadir más subitems aquí según sea necesario
        ]
    },
    {
        id: 6,
        label: 'MENUITEMS.INVENTARIO.TEXT',
        icon: 'ri-layout-grid-fill',
        subItems: [
            {
                id: 40,
                label: 'MENUITEMS.INVENTARIO.LIST.CATEGORIAS',
                link: '/inventario/categorias',
                parentId: 6,
                icon: 'ri-truck-line'
            },
            {
                id: 41,
                label: 'MENUITEMS.INVENTARIO.LIST.SUBCATEGORIAS',
                link: '/inventario/subcategorias',
                parentId: 6,
                icon: 'ri-truck-line'
            }
            // Puedes añadir más subitems aquí según sea necesario
        ]
    }
]