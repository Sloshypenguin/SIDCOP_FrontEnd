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
                label: 'MENUITEMS.GENERAL.LIST.SUCURSALES',
                link: '/general/sucursales',
                parentId: 3,
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
                id: 33,
                label: 'MENUITEMS.LOGISTICA.LIST.BODEGAS',
                link: '/logistica/bodegas',
                parentId: 4,
                icon: 'ri-group-line'
            }
            // Puedes añadir más subitems aquí según sea necesario
        ]
    }
]