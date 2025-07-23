Pant_Id     Pant_Descripcion                                   Pant_EsPadre Pant_Padre  Pant_Icon                                          Pant_Ruta
----------- -------------------------------------------------- ------------ ----------- -------------------------------------------------- ----------------------------------------------------------------------------------------------------
1           Acceso                                             1            NULL        ri-lock-line                                       /acceso
2           General                                            1            NULL        ri-apps-2-line                                     /general
3           Inventario                                         1            NULL        ri-store-2-line                                    /inventario
4           Logistica                                          1            NULL        ri-truck-line                                      /logistica
5           Ventas                                             1            NULL        ri-shopping-cart-2-line                            /ventas
6           Roles                                              0            1           s                                                  /acceso/roles
7           Usuarios                                           0            1           s                                                  /acceso/usuarios
8           Canales                                            0            2           d                                                  /general/canales
9           Cargos                                             0            2           d                                                  /general/cargos
10          Clientes                                           0            2           d                                                  /general/clientes
11          Colonias                                           0            2           d                                                  /general/colonias
12          Departamentos                                      0            2           d                                                  /general/departamentos
13          Empleados                                          0            2           d                                                  /general/empleados
14          Estados Civiles                                    0            2           d                                                  /general/estadosciviles
15          Marcas                                             0            2           d                                                  /general/marcas
16          Marcas de Vehiculos                                0            2           d                                                  /general/marcasvehiculos
17          Modelos                                            0            2           d                                                  /general/modelos
18          Municipios                                         0            2           d                                                  /general/municipios
19          Proveedores                                        0            2           d                                                  /general/proveedores
20          Sucursales                                         0            2           d                                                  /general/sucursales
21          Categorias                                         0            3           a                                                  /inventario/categorias
22          Descuentos                                         0            3           a                                                  /inventario/descuentos
23          Inventario en Bodegas                              0            3           a                                                  /inventario/inventario-bodegas
24          Inventario en Sucursales                           0            3           a                                                  /inventario/inventario-sucursales
25          Productos                                          0            3           a                                                  /inventario/productos
26          Promociones                                        0            3           a                                                  /inventario/promociones
27          Subcategorias                                      0            3           a                                                  /inventario/subcategorias
28          Bodegas                                            0            4           f                                                  /logistica/bodegas
29          Recargas                                           0            4           f                                                  /logistica/recargas
30          Rutas                                              0            4           f                                                  /logistica/rutas
31          Traslados                                          0            4           f                                                  /logistica/traslados
32          CAI                                                0            5           w                                                  /ventas/CAIs
33          Configuracion de Facturas                          0            5           w                                                  /ventas/configuracion-factura
34          Cuentas Por Cobrar                                 0            5           w                                                  /ventas/cuentas-cobrar
35          Devoluciones                                       0            5           w                                                  /ventas/devoluciones
36          Facturas                                           0            5           w                                                  /ventas/facturas
37          Impuestos                                          0            5           w                                                  /ventas/impuestos
38          Pedidos                                            0            5           w                                                  /ventas/pedidos
39          Precios Por Producto                               0            5           w                                                  /ventas/precios-producto
40          Puntos de Emision                                  0            5           w                                                  /ventas/puntos-emision
41          Registros de CAI                                   0            5           w                                                  /ventas/registros-cai
42          Vendedores                                         0            5           w                                                  /ventas/vendedores
43          Vendedores Por Ruta                                0            5           w                                                  /ventas/vendedores-ruta
45          Direcciones Por Cliente                            0            2           d                                                  /general/direcciones-cliente

(44 rows affected)


Completion time: 2025-07-21T14:35:23.3661038-06:00
