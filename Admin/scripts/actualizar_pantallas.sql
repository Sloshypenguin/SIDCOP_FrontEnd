-- Script para actualizar las rutas de Acce.tbPantallas en la base de datos
-- Este script asume que existe una tabla de Acce.tbPantallas con los campos:
-- Pant_Id, Pant_Descripcion, Pant_EsPadre, Pant_Padre, Pant_Icon, Pant_Ruta

-- Actualizar rutas de módulos padres
UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/acceso',
    Pant_Icon = 'ri-lock-line'
WHERE Pant_Id = 1;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general',
    Pant_Icon = 'ri-apps-2-line'
WHERE Pant_Id = 2;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/inventario',
    Pant_Icon = 'ri-store-2-line'
WHERE Pant_Id = 3;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/logistica',
    Pant_Icon = 'ri-truck-line'
WHERE Pant_Id = 4;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas',
    Pant_Icon = 'ri-shopping-cart-2-line'
WHERE Pant_Id = 5;

-- Actualizar rutas de módulo Acceso
UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/acceso/roles'
WHERE Pant_Id = 6;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/acceso/usuarios'
WHERE Pant_Id = 7;

-- Actualizar rutas de módulo General
UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/canales'
WHERE Pant_Id = 8;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/cargos'
WHERE Pant_Id = 9;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/clientes'
WHERE Pant_Id = 10;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/colonias'
WHERE Pant_Id = 11;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/departamentos'
WHERE Pant_Id = 12;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/empleados'
WHERE Pant_Id = 13;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/estadosciviles'
WHERE Pant_Id = 14;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/marcas'
WHERE Pant_Id = 15;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/marcasvehiculos'
WHERE Pant_Id = 16;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/modelos'
WHERE Pant_Id = 17;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/municipios'
WHERE Pant_Id = 18;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/proveedores'
WHERE Pant_Id = 19;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/sucursales'
WHERE Pant_Id = 20;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/general/direcciones-cliente'
WHERE Pant_Id = 45;

-- Actualizar rutas de módulo Inventario
UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/inventario/categorias'
WHERE Pant_Id = 21;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/inventario/descuentos'
WHERE Pant_Id = 22;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/inventario/inventario-bodegas'
WHERE Pant_Id = 23;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/inventario/inventario-sucursales'
WHERE Pant_Id = 24;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/inventario/productos'
WHERE Pant_Id = 25;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/inventario/promociones'
WHERE Pant_Id = 26;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/inventario/subcategorias'
WHERE Pant_Id = 27;

-- Actualizar rutas de módulo Logistica
UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/logistica/bodegas'
WHERE Pant_Id = 28;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/logistica/recargas'
WHERE Pant_Id = 29;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/logistica/rutas'
WHERE Pant_Id = 30;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/logistica/traslados'
WHERE Pant_Id = 31;

-- Actualizar rutas de módulo Ventas
UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/CAIs'
WHERE Pant_Id = 32;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/configuracion-factura'
WHERE Pant_Id = 33;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/cuentas-cobrar'
WHERE Pant_Id = 34;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/devoluciones'
WHERE Pant_Id = 35;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/facturas'
WHERE Pant_Id = 36;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/impuestos'
WHERE Pant_Id = 37;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/pedidos'
WHERE Pant_Id = 38;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/precios-producto'
WHERE Pant_Id = 39;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/puntos-emision'
WHERE Pant_Id = 40;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/registros-cai'
WHERE Pant_Id = 41;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/vendedores'
WHERE Pant_Id = 42;

UPDATE Acce.tbPantallas SET 
    Pant_Ruta = '/ventas/vendedores-ruta'
WHERE Pant_Id = 43;
