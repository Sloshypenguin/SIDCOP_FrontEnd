import { Routes } from "@angular/router";

export const EstadosCivilesRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Sucursales',
        },
        children: [
            { 
                path: '',
                redirectTo: 'list',
                pathMatch: 'full'
            },
            {
                path: 'list',
                loadComponent: () => import('./list/list.component').then(m => m.ListComponent),
                data: {
                    title: 'Listado de Sucursales',
                }
            },
        ]
    }
];
