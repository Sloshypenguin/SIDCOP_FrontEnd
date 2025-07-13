import { Routes } from "@angular/router";

export const EstadosCivilesRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Estados Civiles',
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
                    title: 'Listado de Estados Civiles',
                }
            },
            {
                path: 'create',
                loadComponent: () => import('./create/create.component').then(m => m.CreateComponent),
                data: {
                    title: 'Crear Estado Civil',
                }
            }
            // TODO: Implementar rutas edit y delete cuando sea necesario
            // {
            //     path: 'edit',
            //     loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent),
            //     data: {
            //         title: 'Edit',
            //     }
            // },
            // {
            //     path: 'delete',
            //     loadComponent: () => import('./delete/delete.component').then(m => m.DeleteComponent),
            //     data: {
            //         title: 'Delete',
            //     }
            // }
        ]
    }
];
