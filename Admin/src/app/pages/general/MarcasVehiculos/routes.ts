import { Routes } from "@angular/router";

export const MarcasVehiculosRoutes: Routes = [
    {
        path: '',
        data: {
            title: 'MarcasVehiculos',
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
                    title: 'Listado de MarcasVehiculos',
                }
            },
            {
                path: 'create',
                loadComponent: () => import('./create/create.component').then(m => m.CreateComponent),
                data: {
                    title: 'Crear MarcaVehiculos',
                }
            },
            {
                path: 'edit',
                loadComponent: () => import('./edit/edit.component').then(m => m.EditComponent),
                data: {
                    title: 'Editar MarcaVehiculos',
                }
            },
            {
               path: "details",
               loadComponent: () => import('./details/details.component').then(m => m.DetailsComponent),
               data: {
                   title: 'Detalles de MarcaVehiculos',
               }
            }
        ]
    }
];
