npm run analyze
PS C:\Users\aleja\Documents\GitHub\SIDCOP_FrontEnd\Admin> npm run analyze

> steex@0.0.0 analyze
> node --max-old-space-size=8192 ./node_modules/@angular/cli/bin/ng build --configuration production --source-map
 && npx source-map-explorer dist/steex/**/*.js                                                                   
⠙ Generating browser application bundles (phase: setup)...    Components styles sourcemaps are not generated when
 styles optimization is enabled.                                                                                 ✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Initial chunk files           | Names                                            |  Raw size | Estimated transfer
 size                                                                                                            styles.9f382726f663c8ea.css   | styles                                           |   4.96 MB |                 1.
08 MB                                                                                                            main.cd252f0f2d909a29.js      | main                                             |   1.29 MB |               306.
32 kB                                                                                                            scripts.52aa9237eb9ccab5.js   | scripts                                          | 129.42 kB |                37.
29 kB                                                                                                            polyfills.f48651fed1291a77.js | polyfills                                        |  34.55 kB |                11.
21 kB                                                                                                            runtime.231e0b45f5a6fdf7.js   | runtime                                          |   4.45 kB |                 2.
18 kB                                                                                                            
                              | Initial total                                    |   6.42 MB |                 1.
44 MB                                                                                                            
Lazy chunk files              | Names                                            |  Raw size | Estimated transfer
 size                                                                                                            9515.ff393e35d26755fb.js      | ui-ui-module                                     |   1.16 MB |               177.
01 kB                                                                                                            5211.e3ff84553873fbd5.js      | icons-icons-module                               | 791.61 kB |               106.
13 kB                                                                                                            1066.790529ac8d0d06c4.js      | list-list-component                              | 266.69 kB |                70.
44 kB                                                                                                            9812.9683da691d989cb2.js      | table-table-module                               | 239.27 kB |                41.
79 kB                                                                                                            6112.1df99f75a56eb222.js      | dashboards-dashboards-module                     | 178.78 kB |                35.
92 kB                                                                                                            8165.b1d8c455db959c71.js      | extrapages-extrapages-module                     | 133.13 kB |                24.
45 kB                                                                                                            5323.56e56eaf283936e5.js      | extrapages-extrapages-module                     |  69.18 kB |                15.
77 kB                                                                                                            8846.3529dba37ab8b483.js      | list-list-component                              |  60.76 kB |                 9.
68 kB                                                                                                            470.6dffd163efaa5073.js       | dashboards-dashboards-module                     |  57.82 kB |                15.
03 kB                                                                                                            common.f82cc3f0fd5a13ce.js    | common                                           |  56.05 kB |                 6.
59 kB                                                                                                            1742.adbe5364927f8a4a.js      | list-list-component                              |  52.19 kB |                 7.
77 kB                                                                                                            5339.b55ea3decb276893.js      | list-list-component                              |  50.97 kB |                 7.
38 kB                                                                                                            8418.9fc4fc12ad6ed8a3.js      | list-list-component                              |  46.03 kB |                 7.
77 kB                                                                                                            7463.0dd42d9749c7c82a.js      | list-list-component                              |  45.73 kB |                 7.
93 kB                                                                                                            6070.69063e18b4733d7b.js      | list-list-component                              |  41.58 kB |                 7.
19 kB                                                                                                            2065.892d08d5e5208549.js      | list-list-component                              |  40.77 kB |                 7.
07 kB                                                                                                            5059.199b7749c47b6165.js      | list-list-component                              |  40.62 kB |                 7.
00 kB                                                                                                            3236.a7b06618b5d51798.js      | list-list-component                              |  38.64 kB |                 6.
62 kB                                                                                                            3675.3139f17f1ec886fa.js      | list-list-component                              |  37.80 kB |                 6.
64 kB                                                                                                            7732.0e31d29a1e4015e3.js      | list-list-component                              |  37.64 kB |                 6.
55 kB                                                                                                            7058.e90b63dc63a15fd1.js      | list-list-component                              |  37.59 kB |                 6.
60 kB                                                                                                            5483.83083095fc5b9928.js      | list-list-component                              |  37.18 kB |                 6.
72 kB                                                                                                            6796.2af78d7d4d994beb.js      | account-account-module                           |  37.10 kB |                 4.
86 kB                                                                                                            485.0125245a0647d03f.js       | list-list-component                              |  30.54 kB |                 5.
81 kB                                                                                                            2093.bc17525be652020b.js      | list-list-component                              |  28.77 kB |                 5.
86 kB                                                                                                            6549.7ddec4790294d169.js      | list-list-component                              |  21.07 kB |                 4.
97 kB                                                                                                            8666.c1ce5c43df61ee8d.js      | list-list-component                              |  17.34 kB |                 4.
35 kB                                                                                                            9646.361b16a392b5a501.js      | list-list-component                              |  16.91 kB |                 4.
30 kB                                                                                                            552.5192a16d4a3bfef3.js       | list-list-component                              |  15.04 kB |                 3.
77 kB                                                                                                            4993.049c7a90868ba5a2.js      | list-list-component                              |  14.69 kB |                 3.
72 kB                                                                                                            5224.89ce3b1cbe9670a7.js      | list-list-component                              |  13.91 kB |                 4.
08 kB                                                                                                            6983.c32439188aa19b6f.js      | dashboards-dashboards-module                     |  12.89 kB |                 2.
53 kB                                                                                                            8581.f4e2b2b430023a92.js      | dashboards-dashboards-module                     |  11.06 kB |                 3.
22 kB                                                                                                            5859.93d5ce610c5db704.js      | extraspages-extraspages-module                   |  10.04 kB |                 2.
21 kB                                                                                                            5345.1bc9db1c00d17ae4.js      | pages-pages-module                               |   1.91 kB |               599 
bytes                                                                                                            8074.95a395c93047edea.js      | general-general-module                           |   1.74 kB |               550 
bytes                                                                                                            6415.9d8efd47e0eafc3f.js      | MarcasVehiculos-marcasvehiculos-module           |   1.27 kB |               492 
bytes                                                                                                            3585.25ec28aedcaaa00d.js      | Marcas-marcas-module                             |   1.22 kB |               485 
bytes                                                                                                            8547.9f75b0de6d2699f6.js      | dashboards-dashboards-module                     |   1.19 kB |               577 
bytes                                                                                                            1229.6d295f53d6126810.js      | ventas-ventas-module                             |   1.19 kB |               466 
bytes                                                                                                            1496.0cae2730b97ea04c.js      | subcategorias-subcategorias-module               |   1.00 kB |               452 
bytes                                                                                                            722.d7f168be23105913.js       | categorias-categorias-module                     | 988 bytes |               447 
bytes                                                                                                            6702.7c348f374e42aeb8.js      | configuracionFactura-configuracionFactura-module | 902 bytes |               438 
bytes                                                                                                            7267.87fc1ca91272e26c.js      | puntosemision-puntosemision-module               | 871 bytes |               424 
bytes                                                                                                            5329.e2a1da67a9dab116.js      | estadosciviles-estadosciviles-module             | 869 bytes |               427 
bytes                                                                                                            7637.9f6ed8053319575e.js      | impuestos-impuestos-module                       | 869 bytes |               429 
bytes                                                                                                            7417.b9f9beb8617e00a6.js      | departamentos-departamentos-module               | 864 bytes |               412 
bytes                                                                                                            1460.e5c1da1ac33ba20f.js      | registroscais-registroscais-module               | 860 bytes |               418 
bytes                                                                                                            5284.6eeca9aeb1404af2.js      | proveedores-proveedores-module                   | 858 bytes |               422 
bytes                                                                                                            1259.21a08ffca271784c.js      | municipios-municipios-module                     | 855 bytes |               424 
bytes                                                                                                            5207.c28cd01842e43c3f.js      | sucursales-sucursales-module                     | 855 bytes |               424 
bytes                                                                                                            9628.a42746c55eb2c4aa.js      | vendedor-vendedor-module                         | 855 bytes |               417 
bytes                                                                                                            9894.2bcfa448981a74e8.js      | CAIs-CAIs-module                                 | 854 bytes |               426 
bytes                                                                                                            2367.23b14287566d3f4c.js      | colonias-colonias-module                         | 849 bytes |               422 
bytes                                                                                                            4070.87a60ffe099773be.js      | usuarios-usuarios-module                         | 849 bytes |               419 
bytes                                                                                                            9433.a64cbd2e9c126309.js      | modelos-modelos-module                           | 846 bytes |               420 
bytes                                                                                                            9873.7005ff5203b62451.js      | bodega-bodega-module                             | 845 bytes |               417 
bytes                                                                                                            177.01712ba722179a08.js       | canales-canales-module                           | 843 bytes |               415 
bytes                                                                                                            8361.45384c51c867c059.js      | cargos-cargos-module                             | 843 bytes |               418 
bytes                                                                                                            5924.8d549ea382bba36d.js      | empleados-empleados-module                       | 841 bytes |               420 
bytes                                                                                                            119.97fdbad15e87e835.js       | inventario-inventario-module                     | 790 bytes |               371 
bytes                                                                                                            9151.9245bef9e482fa40.js      | acceso-acceso-module                             | 685 bytes |               342 
bytes                                                                                                            9809.f36258cc496e46da.js      | logistica-logistica-module                       | 685 bytes |               348 
bytes                                                                                                            4612.d855558eb6544093.js      | create-create-component                          | 474 bytes |               311 
bytes                                                                                                            
Build at: 2025-07-17T00:49:41.535Z - Hash: 2ac431a7fde7f94a - Time: 79396ms

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



dist/steex/1066.790529ac8d0d06c4.js
  Unable to map 228/266685 bytes (0.09%)
dist/steex/119.97fdbad15e87e835.js
  Unable to map 174/790 bytes (22.03%)
dist/steex/1229.6d295f53d6126810.js
  Unable to map 172/1185 bytes (14.51%)
dist/steex/1259.21a08ffca271784c.js
  Unable to map 166/855 bytes (19.42%)
dist/steex/1460.e5c1da1ac33ba20f.js
  Unable to map 167/860 bytes (19.42%)
dist/steex/1496.0cae2730b97ea04c.js
  Unable to map 159/1002 bytes (15.87%)
dist/steex/1742.adbe5364927f8a4a.js
  Unable to map 265/52194 bytes (0.51%)
dist/steex/177.01712ba722179a08.js
  Unable to map 161/843 bytes (19.10%)
dist/steex/2065.892d08d5e5208549.js
  Unable to map 263/40773 bytes (0.65%)
dist/steex/2093.bc17525be652020b.js
  Unable to map 294/28769 bytes (1.02%)
dist/steex/2367.23b14287566d3f4c.js
  Unable to map 164/849 bytes (19.32%)
dist/steex/3236.a7b06618b5d51798.js
  Unable to map 265/38644 bytes (0.69%)
dist/steex/3585.25ec28aedcaaa00d.js
  Unable to map 152/1219 bytes (12.47%)
dist/steex/3675.3139f17f1ec886fa.js
  Unable to map 264/37797 bytes (0.70%)
dist/steex/4070.87a60ffe099773be.js
  Unable to map 164/849 bytes (19.32%)
dist/steex/4612.d855558eb6544093.js
  Unable to map 146/474 bytes (30.80%)
dist/steex/470.6dffd163efaa5073.js
  Unable to map 88/57821 bytes (0.15%)
dist/steex/485.0125245a0647d03f.js
  Unable to map 263/30542 bytes (0.86%)
dist/steex/4993.049c7a90868ba5a2.js
  Unable to map 295/14690 bytes (2.01%)
dist/steex/5059.199b7749c47b6165.js
  Unable to map 265/40621 bytes (0.65%)
dist/steex/5207.c28cd01842e43c3f.js
  Unable to map 166/855 bytes (19.42%)
dist/steex/5211.e3ff84553873fbd5.js
  Unable to map 151/791608 bytes (0.02%)
dist/steex/5224.89ce3b1cbe9670a7.js
  Unable to map 383/13914 bytes (2.75%)
dist/steex/5284.6eeca9aeb1404af2.js
  Unable to map 167/858 bytes (19.46%)
dist/steex/5323.56e56eaf283936e5.js
  Unable to map 164/69181 bytes (0.24%)
dist/steex/5329.e2a1da67a9dab116.js
  Unable to map 170/869 bytes (19.56%)
dist/steex/5339.b55ea3decb276893.js
  Unable to map 225/50966 bytes (0.44%)
dist/steex/5345.1bc9db1c00d17ae4.js
  Unable to map 161/1908 bytes (8.44%)
dist/steex/5483.83083095fc5b9928.js
  Unable to map 265/37176 bytes (0.71%)
dist/steex/552.5192a16d4a3bfef3.js
  Unable to map 379/15037 bytes (2.52%)
dist/steex/5859.93d5ce610c5db704.js
  Unable to map 167/10037 bytes (1.66%)
dist/steex/5924.8d549ea382bba36d.js
  Unable to map 165/841 bytes (19.62%)
dist/steex/6070.69063e18b4733d7b.js
  Unable to map 265/41578 bytes (0.64%)
dist/steex/6112.1df99f75a56eb222.js
  Unable to map 203/178776 bytes (0.11%)
dist/steex/6415.9d8efd47e0eafc3f.js
  Unable to map 161/1272 bytes (12.66%)
dist/steex/6549.7ddec4790294d169.js
  Unable to map 285/21071 bytes (1.35%)
dist/steex/6702.7c348f374e42aeb8.js
  Unable to map 176/902 bytes (19.51%)
dist/steex/6796.2af78d7d4d994beb.js
  Unable to map 214/37099 bytes (0.58%)
dist/steex/6983.c32439188aa19b6f.js
  Unable to map 154/12889 bytes (1.19%)
dist/steex/7058.e90b63dc63a15fd1.js
  Unable to map 265/37587 bytes (0.71%)
dist/steex/722.d7f168be23105913.js
  Unable to map 154/988 bytes (15.59%)
dist/steex/7267.87fc1ca91272e26c.js
  Unable to map 168/871 bytes (19.29%)
dist/steex/7417.b9f9beb8617e00a6.js
  Unable to map 169/864 bytes (19.56%)
dist/steex/7463.0dd42d9749c7c82a.js
  Unable to map 265/45728 bytes (0.58%)
dist/steex/7637.9f6ed8053319575e.js
  Unable to map 165/869 bytes (18.99%)
dist/steex/7732.0e31d29a1e4015e3.js
  Unable to map 215/37643 bytes (0.57%)
dist/steex/8074.95a395c93047edea.js
  Unable to map 173/1736 bytes (9.97%)
dist/steex/8165.b1d8c455db959c71.js
  Unable to map 188/133135 bytes (0.14%)
dist/steex/8361.45384c51c867c059.js
  Unable to map 162/843 bytes (19.22%)
dist/steex/8418.9fc4fc12ad6ed8a3.js
  Unable to map 265/46032 bytes (0.58%)
dist/steex/8547.9f75b0de6d2699f6.js
  Unable to map 176/1191 bytes (14.78%)
dist/steex/8581.f4e2b2b430023a92.js
  Unable to map 144/11062 bytes (1.30%)
dist/steex/8666.c1ce5c43df61ee8d.js
  Unable to map 413/17340 bytes (2.38%)
dist/steex/8846.3529dba37ab8b483.js
  Unable to map 265/60764 bytes (0.44%)
dist/steex/9151.9245bef9e482fa40.js
  Unable to map 172/685 bytes (25.11%)
dist/steex/9433.a64cbd2e9c126309.js
  Unable to map 163/846 bytes (19.27%)
dist/steex/9515.ff393e35d26755fb.js
  Unable to map 189/1162892 bytes (0.02%)
dist/steex/9628.a42746c55eb2c4aa.js
  Unable to map 166/855 bytes (19.42%)
dist/steex/9646.361b16a392b5a501.js
  Unable to map 401/16907 bytes (2.37%)
dist/steex/9809.f36258cc496e46da.js
  Unable to map 175/685 bytes (25.55%)
dist/steex/9812.9683da691d989cb2.js
  Unable to map 218/239267 bytes (0.09%)
dist/steex/9873.7005ff5203b62451.js
  Unable to map 162/845 bytes (19.17%)
dist/steex/9894.2bcfa448981a74e8.js
  Unable to map 160/854 bytes (18.74%)
dist/steex/common.f82cc3f0fd5a13ce.js
  Unable to map 225/56051 bytes (0.40%)
dist/steex/main.cd252f0f2d909a29.js
  Unable to map 128/1291114 bytes (0.01%)
dist/steex/polyfills.f48651fed1291a77.js
  Unable to map 89/34550 bytes (0.26%)
dist/steex/runtime.231e0b45f5a6fdf7.js
  Unable to map 23/4453 bytes (0.52%)
dist/steex/scripts.52aa9237eb9ccab5.js
  Unable to map 10/129420 bytes (0.01%)
