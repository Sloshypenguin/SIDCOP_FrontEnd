import { Routes } from "@angular/router";

export const MarcasRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Marcas',
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
                    title: 'Listado de Marcas',
                }
            },
            {
                path: 'create',
                loadComponent: () => import('./create/create.component').then(m => m.CreateComponent),
                data: {
                    title: 'Crear Marca',
                }
            },
            {
                path: 'edit',
                loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent),
                data: {
                    title: 'Editar Marca',
                }
            },
            {
               path: "details",
               loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent),
               data: {
                   title: 'Detalles de Marca',
               }
            }
        ]
    }
];
