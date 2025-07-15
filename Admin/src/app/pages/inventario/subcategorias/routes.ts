import { Routes } from "@angular/router";

export const SubcategoriasRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'Subcategorias',
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
                    title: 'Listado de Subcategorias',
                }
            },
            {
                path: 'create',
                loadComponent: () => import('./create/create.component').then(m => m.CreateComponent),
                data: {
                    title: 'Crear Subcategoria',
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
