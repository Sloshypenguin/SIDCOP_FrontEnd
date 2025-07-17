npm run analyze
PS C:\Users\aleja\Documents\GitHub\SIDCOP_FrontEnd\Admin> npm run analyze                                        

> steex@0.0.0 analyze
> node --max-old-space-size=8192 ./node_modules/@angular/cli/bin/ng build --configuration production --source-map
 && npx source-map-explorer dist/steex/**/*.js                                                                   
⠙ Generating browser application bundles (phase: setup)...    Components styles sourcemaps are not generated when
 styles optimization is enabled.                                                                                 ✔ Browser application bundle generation complete.

Warning: src/app/pages/general/empleados/details/details.component.html:30:65 - warning NG8107: The left side of 
this optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                              
30         <div class="form-control-plaintext">{{ empleadoDetalle?.empl_DNI }}</div>
                                                                   ~~~~~~~~

  src/app/pages/general/empleados/details/details.component.ts:8:16
    8   templateUrl: './details.component.html',
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component DetailsComponent.


Warning: src/app/pages/general/empleados/details/details.component.html:35:65 - warning NG8107: The left side of 
this optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                              
35         <div class="form-control-plaintext">{{ empleadoDetalle?.empl_Correo }}</div>
                                                                   ~~~~~~~~~~~

  src/app/pages/general/empleados/details/details.component.ts:8:16
    8   templateUrl: './details.component.html',
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component DetailsComponent.


Warning: src/app/pages/general/empleados/details/details.component.html:40:65 - warning NG8107: The left side of 
this optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                              
40         <div class="form-control-plaintext">{{ empleadoDetalle?.empl_Telefono }}</div>
                                                                   ~~~~~~~~~~~~~

  src/app/pages/general/empleados/details/details.component.ts:8:16
    8   templateUrl: './details.component.html',
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component DetailsComponent.


Warning: src/app/pages/general/empleados/details/details.component.html:45:65 - warning NG8107: The left side of 
this optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                              
45         <div class="form-control-plaintext">{{ empleadoDetalle?.empl_DireccionExacta }}</div>
                                                                   ~~~~~~~~~~~~~~~~~~~~

  src/app/pages/general/empleados/details/details.component.ts:8:16
    8   templateUrl: './details.component.html',
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component DetailsComponent.


Warning: src/app/pages/general/empleados/details/details.component.html:67:56 - warning NG8107: The left side of 
this optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                              
67           <span class="audit-user">{{ empleadoDetalle?.usua_Creacion || 'N/A' }}</span>
                                                          ~~~~~~~~~~~~~

  src/app/pages/general/empleados/details/details.component.ts:8:16
    8   templateUrl: './details.component.html',
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component DetailsComponent.


Warning: src/app/pages/general/proveedores/edit/edit.component.html:25:184 - warning NG8107: The left side of thi
s optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                                 
25           <input type="text" class="form-control" [(ngModel)]="proveedor.prov_Codigo" placeholder="Código del 
proveedor" [class.is-invalid]="mostrarErrores && !proveedor.prov_Codigo?.trim()">                                                                                                                                                 
                                                                         ~~~~

  src/app/pages/general/proveedores/edit/edit.component.ts:12:16
    12   templateUrl: './edit.component.html',
                      ~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component EditComponent.


Warning: src/app/pages/general/proveedores/edit/edit.component.html:34:207 - warning NG8107: The left side of thi
s optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                                 
34           <input type="text" class="form-control" [(ngModel)]="proveedor.prov_NombreEmpresa" placeholder="Nomb
re de la empresa" required [class.is-invalid]="mostrarErrores && !proveedor.prov_NombreEmpresa?.trim()">                                                                                                                          
                                                                                                ~~~~

  src/app/pages/general/proveedores/edit/edit.component.ts:12:16
    12   templateUrl: './edit.component.html',
                      ~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component EditComponent.


Warning: src/app/pages/general/proveedores/edit/edit.component.html:45:199 - warning NG8107: The left side of thi
s optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                                 
45           <input type="text" class="form-control" [(ngModel)]="proveedor.prov_NombreContacto" placeholder="Nom
bre del contacto" [class.is-invalid]="mostrarErrores && !proveedor.prov_NombreContacto?.trim()">                                                                                                                                  
                                                                                        ~~~~

  src/app/pages/general/proveedores/edit/edit.component.ts:12:16
    12   templateUrl: './edit.component.html',
                      ~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component EditComponent.


Warning: src/app/pages/general/proveedores/edit/edit.component.html:54:176 - warning NG8107: The left side of thi
s optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                                 
54           <input type="text" class="form-control" [(ngModel)]="proveedor.prov_Telefono" placeholder="Teléfono"
 [class.is-invalid]="mostrarErrores && !proveedor.prov_Telefono?.trim()">                                                                                                                                                         
                                                                 ~~~~

  src/app/pages/general/proveedores/edit/edit.component.ts:12:16
    12   templateUrl: './edit.component.html',
                      ~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component EditComponent.


Warning: src/app/pages/general/proveedores/edit/edit.component.html:65:183 - warning NG8107: The left side of thi
s optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                                 
65           <input type="email" class="form-control" [(ngModel)]="proveedor.prov_Correo" placeholder="Correo ele
ctrónico" [class.is-invalid]="mostrarErrores && !proveedor.prov_Correo?.trim()">                                                                                                                                                  
                                                                        ~~~~

  src/app/pages/general/proveedores/edit/edit.component.ts:12:16
    12   templateUrl: './edit.component.html',
                      ~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component EditComponent.


Warning: src/app/pages/general/proveedores/edit/edit.component.html:74:198 - warning NG8107: The left side of thi
s optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                                 
74           <input type="text" class="form-control" [(ngModel)]="proveedor.prov_DireccionExacta" placeholder="Di
rección exacta" [class.is-invalid]="mostrarErrores && !proveedor.prov_DireccionExacta?.trim()">                                                                                                                                   
                                                                                       ~~~~

  src/app/pages/general/proveedores/edit/edit.component.ts:12:16
    12   templateUrl: './edit.component.html',
                      ~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component EditComponent.


Warning: src/app/pages/general/proveedores/edit/edit.component.html:139:182 - warning NG8107: The left side of th
is optional chain operation does not include 'null' or 'undefined' in its type, therefore the '?.' operator can be replaced with the '.' operator.                                                                                
139           <textarea class="form-control" [(ngModel)]="proveedor.prov_Observaciones" placeholder="Observacione
s" [class.is-invalid]="mostrarErrores && !proveedor.prov_Observaciones?.trim()"></textarea>                                                                                                                                       
                                                                        ~~~~

  src/app/pages/general/proveedores/edit/edit.component.ts:12:16
    12   templateUrl: './edit.component.html',
                      ~~~~~~~~~~~~~~~~~~~~~~~
    Error occurs in the template of component EditComponent.




Error: src/app/pages/ventas/registroscais/create/create.component.ts:7:20 - error TS2307: Cannot find module '@fu
llcalendar/core/internal-common' or its corresponding type declarations.                                         
7 import { co } from '@fullcalendar/core/internal-common';
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



