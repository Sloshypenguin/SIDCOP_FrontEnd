# Proceso de Venta - SIDCOP

## 1. Descripción General

El proceso de venta en SIDCOP comprende todas las actividades desde la selección de productos hasta la emisión de facturas y gestión de cuentas por cobrar para ventas a crédito. Este documento detalla los pasos del proceso, los procedimientos almacenados necesarios y la estructura de datos utilizada.

## 2. Flujo del Proceso de Venta

### 2.1. Pre-venta

1. **Consulta de productos y precios**
   - Verificación de existencias en inventario
   - Consulta de precios (considerando posibles promociones o descuentos)
   - Verificación de límites de crédito para clientes

2. **Preparación de documentos fiscales**
   - Verificación de CAIs disponibles
   - Obtención de correlativo de factura
   - Validación de configuración fiscal

### 2.2. Proceso de Venta

1. **Creación de factura**
   - Selección de cliente
   - Selección de vendedor
   - Asignación de tipo de venta (contado/crédito)
   - Selección de productos y cantidades
   - Cálculo de subtotales, impuestos y totales

2. **Confirmación y emisión**
   - Generación de documento fiscal
   - Impresión o envío electrónico
   - Registro de pago (para ventas de contado)
   - Creación de cuenta por cobrar (para ventas a crédito)

### 2.3. Post-venta

1. **Gestión de inventario**
   - Descuento de productos del inventario
   - Actualización de existencias

2. **Gestión financiera**
   - Actualización de saldo de cliente (ventas a crédito)
   - Registro de ingresos (ventas de contado)

3. **Posibles acciones posteriores**
   - Anulación de factura (con reversión de inventario)
   - Registro de pagos parciales (cuentas por cobrar)
   - Emisión de reportes de ventas

## 3. Procedimientos Almacenados Requeridos

### 3.1. Consultas Pre-venta

- **UDP_tbProductos_GetPrecios**: Consulta precios y existencias de múltiples productos
- **UDP_tbClientes_VerificarCredito**: Verifica límite de crédito para un cliente
- **UDP_tbRegistrosCAI_ListDisponibles**: Lista registros CAI disponibles

### 3.2. Gestión de Facturas

- **UDP_tbFacturas_List**: Listado paginado de facturas con filtros
- **UDP_tbFacturas_Find**: Obtener una factura específica con sus detalles
- **UDP_tbFacturas_Insert**: Crear nueva factura con sus detalles
- **UDP_tbFacturas_Update**: Actualizar datos limitados de una factura
- **UDP_tbFacturas_Anular**: Anular una factura y revertir inventario

### 3.3. Gestión de Cuentas por Cobrar

- **UDP_tbCuentasPorCobrar_List**: Listar cuentas por cobrar (paginado)
- **UDP_tbCuentasPorCobrar_Find**: Obtener detalle de una cuenta por cobrar
- **UDP_tbCuentasPorCobrar_RegistrarPago**: Registrar pago a una cuenta por cobrar

### 3.4. Auxiliares

- **UDP_tbClientes_ListActivos**: Listar clientes activos para selección
- **UDP_tbProductos_ListActivos**: Listar productos disponibles
- **UDP_tbVendedores_ListActivos**: Listar vendedores activos
- **UDP_tbConfiguracionFacturas_Find**: Obtener configuración de facturación

## 4. Consideraciones Especiales

### 4.1. Transacciones

Las operaciones críticas como la inserción de facturas y la anulación deben realizarse dentro de transacciones para garantizar la integridad de los datos.

### 4.2. Concurrencia

El sistema debe manejar adecuadamente los escenarios de concurrencia, especialmente en la actualización de inventario.

### 4.3. Auditoría

Todas las operaciones deben registrar el usuario que las realiza y la fecha/hora de la acción.

### 4.4. Validaciones

- Existencia suficiente en inventario
- Validez de los CAIs
- Límite de crédito para clientes
- Permisos de usuario para realizar operaciones

## 5. Integración con el Frontend

El frontend utilizará servicios Angular que consuman los procedimientos almacenados a través de una API REST. La estructura recomendada incluye:

- Módulos separados para facturas y cuentas por cobrar
- Componentes para listado, creación, detalle y anulación
- Servicios para cada entidad principal
- Modelos TypeScript que reflejen la estructura de datos
