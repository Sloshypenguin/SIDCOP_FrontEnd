import { Routes } from "@angular/router";

export const MunicipiosRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Municipios',
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
                    title: 'Listado de Municipios',
                }
            },
            {
                path: 'create',
                loadComponent: () => import('./create/create.component').then(m => m.CreateComponent),
                data: {
                    title: 'Crear Municipio',
                }
            },
            // TODO: Implementar rutas edit y delete cuando sea necesario
            {
                path: 'edit',
                loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent),
                data: {
                    title: 'Edit',
                }
            },
            {
                path: 'details',
                loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent),
                data: {
                    title: 'Details',
                }
            },
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
