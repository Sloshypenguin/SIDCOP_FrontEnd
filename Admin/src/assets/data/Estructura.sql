USE [BDD_SIDCOP]
GO
/****** Object:  Schema [Acce]    Script Date: 24/07/2025 19:41:04 ******/
CREATE SCHEMA [Acce]
GO
/****** Object:  Schema [Gral]    Script Date: 24/07/2025 19:41:04 ******/
CREATE SCHEMA [Gral]
GO
/****** Object:  Schema [Inve]    Script Date: 24/07/2025 19:41:04 ******/
CREATE SCHEMA [Inve]
GO
/****** Object:  Schema [Logi]    Script Date: 24/07/2025 19:41:04 ******/
CREATE SCHEMA [Logi]
GO
/****** Object:  Schema [Vnta]    Script Date: 24/07/2025 19:41:04 ******/
CREATE SCHEMA [Vnta]
GO
/****** Object:  Table [Acce].[tbAcciones]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Acce].[tbAcciones](
	[Acci_Id] [int] IDENTITY(1,1) NOT NULL,
	[Acci_Descripcion] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Acce_tbAcciones_Acci_Id] PRIMARY KEY CLUSTERED 
(
	[Acci_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Acce].[tbAccionesPorPantalla]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Acce].[tbAccionesPorPantalla](
	[AcPa_Id] [int] IDENTITY(1,1) NOT NULL,
	[Pant_Id] [int] NOT NULL,
	[Acci_Id] [int] NOT NULL,
 CONSTRAINT [PK_Acce_tbAccionesPorPantalla_AcPa_Id] PRIMARY KEY CLUSTERED 
(
	[AcPa_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Acce].[tbPantallas]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Acce].[tbPantallas](
	[Pant_Id] [int] IDENTITY(1,1) NOT NULL,
	[Pant_Descripcion] [varchar](50) NOT NULL,
	[Pant_EsPadre] [bit] NOT NULL,
	[Pant_Padre] [int] NULL,
	[Pant_Icon] [varchar](50) NOT NULL,
	[Pant_Ruta] [varchar](100) NOT NULL,
 CONSTRAINT [PK_Acce_tbPantallas_Pant_Id] PRIMARY KEY CLUSTERED 
(
	[Pant_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Acce].[tbPermisos]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Acce].[tbPermisos](
	[Perm_Id] [int] IDENTITY(1,1) NOT NULL,
	[Role_Id] [int] NOT NULL,
	[AcPa_Id] [int] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Perm_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Perm_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Acce_tbPermisos_Perm_Id] PRIMARY KEY CLUSTERED 
(
	[Perm_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Acce].[tbRoles]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Acce].[tbRoles](
	[Role_Id] [int] IDENTITY(1,1) NOT NULL,
	[Role_Descripcion] [varchar](50) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Role_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Role_FechaModificacion] [datetime] NULL,
	[Role_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Acce_tbRoles_Role_Id] PRIMARY KEY CLUSTERED 
(
	[Role_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Acce].[tbUsuarios]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Acce].[tbUsuarios](
	[Usua_Id] [int] IDENTITY(1,1) NOT NULL,
	[Usua_Usuario] [varchar](50) NOT NULL,
	[Usua_Clave] [varbinary](max) NOT NULL,
	[Role_Id] [int] NOT NULL,
	[Usua_IdPersona] [int] NOT NULL,
	[Usua_EsVendedor] [bit] NOT NULL,
	[Usua_EsAdmin] [bit] NOT NULL,
	[Usua_Imagen] [varchar](max) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Usua_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Usua_FechaModificacion] [datetime] NULL,
	[Usua_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Acce_tbUsuarios_Usua_Id] PRIMARY KEY CLUSTERED 
(
	[Usua_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbAvales]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbAvales](
	[Aval_Id] [int] IDENTITY(1,1) NOT NULL,
	[Clie_Id] [int] NOT NULL,
	[Aval_Nombres] [varchar](50) NOT NULL,
	[Aval_Apellidos] [varchar](50) NOT NULL,
	[Aval_ParentescoConCliente] [varchar](50) NOT NULL,
	[Aval_DNI] [varchar](15) NOT NULL,
	[Aval_Telefono] [varchar](13) NOT NULL,
	[TiVi_Id] [int] NOT NULL,
	[Aval_DireccionExacta] [varchar](200) NOT NULL,
	[Colo_Id] [int] NOT NULL,
	[Aval_FechaNacimiento] [datetime] NULL,
	[EsCv_Id] [int] NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Aval_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Aval_FechaModificacion] [datetime] NULL,
	[Aval_Estado] [bit] NOT NULL,
	[Aval_Sexo] [char](1) NULL,
 CONSTRAINT [PK_Gral_tbAvales_Aval_Id] PRIMARY KEY CLUSTERED 
(
	[Aval_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbCanales]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbCanales](
	[Cana_Id] [int] IDENTITY(1,1) NOT NULL,
	[Cana_Descripcion] [varchar](50) NOT NULL,
	[Cana_Observaciones] [varchar](200) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Cana_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Cana_FechaModificacion] [datetime] NULL,
	[Cana_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Gral_tbCanales_Cana_Id] PRIMARY KEY CLUSTERED 
(
	[Cana_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbCargos]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbCargos](
	[Carg_Id] [int] IDENTITY(1,1) NOT NULL,
	[Carg_Descripcion] [varchar](100) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Carg_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Carg_FechaModificacion] [datetime] NULL,
	[Carg_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Gral_tbCargos_Carg_Id] PRIMARY KEY CLUSTERED 
(
	[Carg_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbClientes]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbClientes](
	[Clie_Id] [int] IDENTITY(1,1) NOT NULL,
	[Clie_Codigo] [varchar](10) NOT NULL,
	[Clie_Nacionalidad] [varchar](3) NULL,
	[Clie_DNI] [varchar](15) NULL,
	[Clie_RTN] [varchar](16) NOT NULL,
	[Clie_Nombres] [varchar](50) NOT NULL,
	[Clie_Apellidos] [varchar](50) NOT NULL,
	[Clie_NombreNegocio] [varchar](50) NOT NULL,
	[Clie_ImagenDelNegocio] [varchar](max) NOT NULL,
	[Clie_Telefono] [varchar](17) NOT NULL,
	[Clie_Correo] [varchar](40) NULL,
	[Clie_Sexo] [char](1) NOT NULL,
	[Clie_FechaNacimiento] [datetime] NULL,
	[TiVi_Id] [int] NULL,
	[Cana_Id] [int] NOT NULL,
	[EsCv_Id] [int] NULL,
	[Ruta_Id] [int] NULL,
	[Clie_LimiteCredito] [decimal](12, 2) NULL,
	[Clie_DiasCredito] [int] NULL,
	[Clie_Saldo] [decimal](12, 2) NULL,
	[Clie_Vencido] [bit] NULL,
	[Clie_Observaciones] [varchar](200) NULL,
	[Clie_ObservacionRetiro] [varchar](200) NULL,
	[Clie_Confirmacion] [bit] NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Clie_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Clie_FechaModificacion] [datetime] NULL,
	[Clie_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Gral_tbClientes_Clie_Id] PRIMARY KEY CLUSTERED 
(
	[Clie_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbColonias]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbColonias](
	[Colo_Id] [int] IDENTITY(1,1) NOT NULL,
	[Colo_Descripcion] [varchar](100) NOT NULL,
	[Muni_Codigo] [varchar](4) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Colo_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Colo_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Gral_tbColonias_Colo_Id] PRIMARY KEY CLUSTERED 
(
	[Colo_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbDepartamentos]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbDepartamentos](
	[Depa_Codigo] [varchar](2) NOT NULL,
	[Depa_Descripcion] [varchar](100) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Depa_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Depa_FechaModificacion] [datetime] NULL,
	[Pais_Codigo] [varchar](3) NULL,
 CONSTRAINT [PK_Gral_tbDepartamentos_Depa_Codigo] PRIMARY KEY CLUSTERED 
(
	[Depa_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbDireccionesPorCliente]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbDireccionesPorCliente](
	[DiCl_Id] [int] IDENTITY(1,1) NOT NULL,
	[Clie_Id] [int] NOT NULL,
	[Colo_Id] [int] NOT NULL,
	[DiCl_DireccionExacta] [varchar](200) NOT NULL,
	[DiCl_Observaciones] [nvarchar](200) NULL,
	[DiCl_Latitud] [decimal](11, 6) NULL,
	[DiCl_Longitud] [decimal](11, 6) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[DiCl_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[DiCl_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Gral_tbDireccionesPorCliente_DiCl_Id] PRIMARY KEY CLUSTERED 
(
	[DiCl_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbEmpleados]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbEmpleados](
	[Empl_Id] [int] IDENTITY(1,1) NOT NULL,
	[Empl_DNI] [varchar](15) NOT NULL,
	[Empl_Codigo] [varchar](20) NOT NULL,
	[Empl_Nombres] [varchar](50) NOT NULL,
	[Empl_Apellidos] [varchar](50) NOT NULL,
	[Empl_Sexo] [char](1) NOT NULL,
	[Empl_FechaNacimiento] [datetime] NOT NULL,
	[Empl_Correo] [varchar](50) NOT NULL,
	[Empl_Telefono] [varchar](17) NOT NULL,
	[Sucu_Id] [int] NOT NULL,
	[EsCv_Id] [int] NOT NULL,
	[Carg_Id] [int] NOT NULL,
	[Colo_Id] [int] NOT NULL,
	[Empl_DireccionExacta] [varchar](200) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Empl_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Empl_FechaModificacion] [datetime] NULL,
	[Empl_Estado] [bit] NOT NULL,
	[Empl_Imagen] [varchar](max) NULL,
 CONSTRAINT [PK_Gral_tbEmpleados_Empl_Id] PRIMARY KEY CLUSTERED 
(
	[Empl_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbEstadosCiviles]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbEstadosCiviles](
	[EsCv_Id] [int] IDENTITY(1,1) NOT NULL,
	[EsCv_Descripcion] [varchar](100) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[EsCv_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[EsCv_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Gral_tbEstadosCiviles_EsCv_Id] PRIMARY KEY CLUSTERED 
(
	[EsCv_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbMarcas]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbMarcas](
	[Marc_Id] [int] IDENTITY(1,1) NOT NULL,
	[Marc_Descripcion] [varchar](40) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Marc_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Marc_FechaModificacion] [datetime] NULL,
	[Marc_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Gral_tbMarcas_Marc_Id] PRIMARY KEY CLUSTERED 
(
	[Marc_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbMarcasVehiculos]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbMarcasVehiculos](
	[MaVe_Id] [int] IDENTITY(1,1) NOT NULL,
	[MaVe_Marca] [varchar](70) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[MaVe_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[MaVe_FechaModificacion] [datetime] NULL,
	[MaVe_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Gral_tbMarcasVehiculos_MaVe_Id] PRIMARY KEY CLUSTERED 
(
	[MaVe_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbModelos]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbModelos](
	[Mode_Id] [int] IDENTITY(1,1) NOT NULL,
	[MaVe_Id] [int] NOT NULL,
	[Mode_Descripcion] [varchar](50) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Mode_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Mode_FechaModificacion] [datetime] NULL,
	[Mode_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Gral_tbModelos_Mode_Id] PRIMARY KEY CLUSTERED 
(
	[Mode_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbMunicipios]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbMunicipios](
	[Muni_Codigo] [varchar](4) NOT NULL,
	[Muni_Descripcion] [varchar](50) NOT NULL,
	[Depa_Codigo] [varchar](2) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Muni_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Muni_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Gral_tbMunicipios_Muni_Codigo] PRIMARY KEY CLUSTERED 
(
	[Muni_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbPaises]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbPaises](
	[Pais_Codigo] [varchar](3) NOT NULL,
	[Pais_Descripcion] [varchar](100) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Pais_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Pais_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Gral_tbPaises_Pais_Codigo] PRIMARY KEY CLUSTERED 
(
	[Pais_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbProveedores]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbProveedores](
	[Prov_Id] [int] IDENTITY(1,1) NOT NULL,
	[Prov_Codigo] [varchar](10) NOT NULL,
	[Prov_NombreEmpresa] [varchar](50) NOT NULL,
	[Prov_NombreContacto] [varchar](50) NOT NULL,
	[Colo_Id] [int] NOT NULL,
	[Prov_DireccionExacta] [varchar](200) NULL,
	[Prov_Telefono] [varchar](17) NULL,
	[Prov_Correo] [varchar](40) NULL,
	[Prov_Observaciones] [varchar](200) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Prov_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Prov_FechaModificacion] [datetime] NULL,
	[Prov_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Gral_tbProveedores_Proveedor_Id] PRIMARY KEY CLUSTERED 
(
	[Prov_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbSucursales]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbSucursales](
	[Sucu_Id] [int] IDENTITY(1,1) NOT NULL,
	[Sucu_Descripcion] [varchar](80) NOT NULL,
	[Colo_Id] [int] NOT NULL,
	[Sucu_DireccionExacta] [varchar](100) NOT NULL,
	[Sucu_Telefono1] [varchar](10) NOT NULL,
	[Sucu_Telefono2] [varchar](10) NULL,
	[Sucu_Correo] [varchar](100) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Sucu_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Sucu_FechaModificacion] [datetime] NULL,
	[Sucu_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Gral_tbSucursales_Sucu_Id] PRIMARY KEY CLUSTERED 
(
	[Sucu_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Gral].[tbTiposDeVivienda]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Gral].[tbTiposDeVivienda](
	[TiVi_Id] [int] IDENTITY(1,1) NOT NULL,
	[TiVi_Descripcion] [varchar](50) NOT NULL,
	[TiVi_Observaciones] [varchar](200) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[TiVi_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[TiVi_FechaModificacion] [datetime] NULL,
	[TiVi_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Gral_tbTiposDeVivienda_TiVi_Id] PRIMARY KEY CLUSTERED 
(
	[TiVi_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbCategorias]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbCategorias](
	[Cate_Id] [int] IDENTITY(1,1) NOT NULL,
	[Cate_Descripcion] [varchar](100) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Cate_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Cate_FechaModificacion] [datetime] NULL,
	[Cate_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Inve_tbCategorias_Cate_Id] PRIMARY KEY CLUSTERED 
(
	[Cate_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbDescuentoPorClientes]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbDescuentoPorClientes](
	[DeCl_Id] [int] IDENTITY(1,1) NOT NULL,
	[Desc_Id] [int] NOT NULL,
	[Clie_Id] [int] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[DeEs_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[DeEs_FechaModificacion] [datetime] NULL,
	[DeCl_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Inve_tbDescuentoPorClientes_DeEs_Id] PRIMARY KEY CLUSTERED 
(
	[DeCl_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbDescuentos]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbDescuentos](
	[Desc_Id] [int] IDENTITY(1,1) NOT NULL,
	[Desc_Descripcion] [varchar](100) NOT NULL,
	[Desc_Tipo] [bit] NOT NULL,
	[Desc_Aplicar] [char](1) NOT NULL,
	[Desc_FechaInicio] [datetime] NOT NULL,
	[Desc_FechaFin] [datetime] NOT NULL,
	[Desc_Observaciones] [varchar](200) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Desc_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Desc_FechaModificacion] [datetime] NULL,
	[Desc_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Inve_tbDescuentos_Desc_Id] PRIMARY KEY CLUSTERED 
(
	[Desc_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbDescuentosDetalle]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbDescuentosDetalle](
	[DesD_Id] [int] IDENTITY(1,1) NOT NULL,
	[Desc_Id] [int] NOT NULL,
	[DesD_IdReferencia] [int] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[DesD_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[DesD_FechaModificacion] [datetime] NULL,
	[DesD_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Inve_tbDescuentosDetalle_Desd_Id] PRIMARY KEY CLUSTERED 
(
	[DesD_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbDescuentosPorEscala]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbDescuentosPorEscala](
	[DeEs_Id] [int] IDENTITY(1,1) NOT NULL,
	[Desc_Id] [int] NOT NULL,
	[DeEs_InicioEscala] [int] NOT NULL,
	[DeEs_FinEscala] [int] NOT NULL,
	[DeEs_Valor] [decimal](18, 2) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[DeEs_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[DeEs_FechaModificacion] [datetime] NULL,
	[DeEs_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Inve_tbDescuentosPorEscala_DeEs_Id] PRIMARY KEY CLUSTERED 
(
	[DeEs_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbInventarioBodegas]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbInventarioBodegas](
	[InBo_Id] [int] IDENTITY(1,1) NOT NULL,
	[Bode_Id] [int] NOT NULL,
	[Prod_Id] [int] NOT NULL,
	[InBo_Cantidad] [int] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[InBo_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[InBo_FechaModificacion] [datetime] NULL,
	[InBo_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Inve_tbInventarioBodegas_InBo_Id] PRIMARY KEY CLUSTERED 
(
	[InBo_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbInventarioSucursales]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbInventarioSucursales](
	[InSu_Id] [int] IDENTITY(1,1) NOT NULL,
	[Sucu_Id] [int] NOT NULL,
	[Prod_Id] [int] NOT NULL,
	[InSu_Cantidad] [int] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[InSu_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[InSu_FechaModificacion] [datetime] NULL,
	[InSu_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Inve_tbInventarioSucursales_InSu_Id] PRIMARY KEY CLUSTERED 
(
	[InSu_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbProductos]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbProductos](
	[Prod_Id] [int] IDENTITY(1,1) NOT NULL,
	[Prod_Codigo] [varchar](10) NOT NULL,
	[Prod_CodigoBarra] [varchar](40) NULL,
	[Prod_Descripcion] [varchar](70) NULL,
	[Prod_DescripcionCorta] [varchar](50) NOT NULL,
	[Prod_Imagen] [varchar](max) NULL,
	[Subc_Id] [int] NOT NULL,
	[Marc_Id] [int] NOT NULL,
	[Prov_Id] [int] NOT NULL,
	[Impu_Id] [int] NULL,
	[Prod_PrecioUnitario] [decimal](10, 2) NULL,
	[Prod_CostoTotal] [decimal](10, 2) NULL,
	[Prod_PagaImpuesto] [char](1) NULL,
	[Prod_PromODesc] [int] NULL,
	[Prod_EsPromo] [char](1) NULL,
	[Prod_Estado] [bit] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Prod_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Prod_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Inve_tbProductos_Prod_Id] PRIMARY KEY CLUSTERED 
(
	[Prod_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbPromociones]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbPromociones](
	[Prom_Id] [int] IDENTITY(1,1) NOT NULL,
	[Prom_Descripcion] [varchar](100) NOT NULL,
	[Prom_Tipo] [bit] NOT NULL,
	[Prom_Aplicar] [char](1) NOT NULL,
	[Prom_Valor] [decimal](18, 2) NOT NULL,
	[Prom_FechaInicio] [datetime] NOT NULL,
	[Prom_FechaFin] [datetime] NOT NULL,
	[Muni_Codigo] [varchar](4) NULL,
	[Sucu_Id] [int] NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Prom_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Prom_FechaModificacion] [datetime] NULL,
	[Prom_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Inve_tbPromociones_Prom_Id] PRIMARY KEY CLUSTERED 
(
	[Prom_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbPromocionesDetalle]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbPromocionesDetalle](
	[PrDe_Id] [int] IDENTITY(1,1) NOT NULL,
	[Prom_Id] [int] NOT NULL,
	[PrDe_IdReferencia] [int] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[PrDe_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[PrDe_FechaModificacion] [datetime] NULL,
	[PrDe_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Inve_tbPromocionesDetalle_PrDe_Id] PRIMARY KEY CLUSTERED 
(
	[PrDe_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Inve].[tbSubcategorias]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Inve].[tbSubcategorias](
	[Subc_Id] [int] IDENTITY(1,1) NOT NULL,
	[Subc_Descripcion] [varchar](50) NOT NULL,
	[Cate_Id] [int] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Subc_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Subc_FechaModificacion] [datetime] NULL,
	[Subc_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Inve_tbSubcategorias_Subc_Id] PRIMARY KEY CLUSTERED 
(
	[Subc_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Logi].[tbBodegas]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Logi].[tbBodegas](
	[Bode_Id] [int] IDENTITY(1,1) NOT NULL,
	[Bode_Descripcion] [varchar](50) NOT NULL,
	[Sucu_Id] [int] NOT NULL,
	[RegC_Id] [int] NOT NULL,
	[Vend_Id] [int] NOT NULL,
	[Mode_Id] [int] NOT NULL,
	[Bode_VIN] [varchar](50) NOT NULL,
	[Bode_Placa] [varchar](15) NOT NULL,
	[Bode_Capacidad] [numeric](8, 2) NOT NULL,
	[Bode_TipoCamion] [char](1) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Bode_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Bode_FechaModificacion] [datetime] NULL,
	[Bode_Estado] [bit] NULL,
 CONSTRAINT [PK_Logi_tbBodegas_Bode_Id] PRIMARY KEY CLUSTERED 
(
	[Bode_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Logi].[tbRecargas]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Logi].[tbRecargas](
	[Reca_Id] [int] IDENTITY(1,1) NOT NULL,
	[Vend_Id] [int] NOT NULL,
	[Bode_Id] [int] NOT NULL,
	[Tras_Id] [int] NULL,
	[Reca_Fecha] [datetime] NOT NULL,
	[Reca_Observaciones] [varchar](200) NULL,
	[Usua_Confirmacion] [int] NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Reca_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Reca_FechaModificacion] [datetime] NULL,
	[Reca_Estado] [bit] NOT NULL,
	[Reca_Confirmacion] [char](1) NULL,
 CONSTRAINT [PK_Logi_tbRecargas_Reca_Id] PRIMARY KEY CLUSTERED 
(
	[Reca_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Logi].[tbRecargasDetalle]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Logi].[tbRecargasDetalle](
	[ReDe_Id] [int] IDENTITY(1,1) NOT NULL,
	[Reca_Id] [int] NOT NULL,
	[Prod_Id] [int] NOT NULL,
	[ReDe_Cantidad] [int] NOT NULL,
	[ReDe_Observaciones] [varchar](200) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[ReDe_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[ReDe_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Logi_tbRecargasDetalle_ReDe_Id] PRIMARY KEY CLUSTERED 
(
	[ReDe_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Logi].[tbRutas]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Logi].[tbRutas](
	[Ruta_Id] [int] IDENTITY(1,1) NOT NULL,
	[Ruta_Codigo] [varchar](20) NOT NULL,
	[Ruta_Descripcion] [varchar](50) NOT NULL,
	[Ruta_Observaciones] [varchar](200) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Ruta_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Ruta_FechaModificacion] [datetime] NULL,
	[Ruta_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Logi_tbRutas_Ruta_Id] PRIMARY KEY CLUSTERED 
(
	[Ruta_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Logi].[tbTraslados]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Logi].[tbTraslados](
	[Tras_Id] [int] IDENTITY(1,1) NOT NULL,
	[Tras_Origen] [int] NOT NULL,
	[Tras_Destino] [int] NOT NULL,
	[Tras_Fecha] [datetime] NOT NULL,
	[Tras_Observaciones] [varchar](200) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Tras_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Tras_FechaModificacion] [datetime] NULL,
	[Tras_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Logi_tbTraslados_Tras_Id] PRIMARY KEY CLUSTERED 
(
	[Tras_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Logi].[tbTrasladosDetalle]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Logi].[tbTrasladosDetalle](
	[TrDe_Id] [int] IDENTITY(1,1) NOT NULL,
	[Tras_Id] [int] NOT NULL,
	[Prod_Id] [int] NOT NULL,
	[TrDe_Cantidad] [int] NOT NULL,
	[TrDe_Observaciones] [varchar](200) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[TrDe_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[TrDe_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Logi_TrasladosDetalle_ProT_Id] PRIMARY KEY CLUSTERED 
(
	[TrDe_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbCAIs]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbCAIs](
	[NCai_Id] [int] IDENTITY(1,1) NOT NULL,
	[NCai_Codigo] [varchar](37) NOT NULL,
	[NCai_Descripcion] [varchar](100) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[NCai_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[NCai_FechaModificacion] [datetime] NULL,
	[NCai_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Vnta_tbCAIs_NCai_Id] PRIMARY KEY CLUSTERED 
(
	[NCai_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbConfiguracionFacturas]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbConfiguracionFacturas](
	[CoFa_Id] [int] IDENTITY(1,1) NOT NULL,
	[CoFa_NombreEmpresa] [varchar](100) NULL,
	[CoFa_DireccionEmpresa] [varchar](100) NOT NULL,
	[CoFa_RTN] [varchar](100) NOT NULL,
	[CoFa_Correo] [varchar](100) NOT NULL,
	[CoFa_Telefono1] [varchar](10) NOT NULL,
	[CoFa_Telefono2] [varchar](10) NULL,
	[CoFa_Logo] [varchar](max) NOT NULL,
	[Colo_Id] [int] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[CoFa_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[CoFa_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Vnta_tbConfiguracionFacturas_CoFa_Id] PRIMARY KEY CLUSTERED 
(
	[CoFa_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbCuentasPorCobrar]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbCuentasPorCobrar](
	[CPCo_Id] [int] IDENTITY(1,1) NOT NULL,
	[Clie_Id] [int] NOT NULL,
	[Fact_Id] [int] NOT NULL,
	[CPCo_FechaEmision] [date] NOT NULL,
	[CPCo_FechaVencimiento] [date] NULL,
	[CPCo_Valor] [decimal](12, 2) NOT NULL,
	[CPCo_Saldo] [decimal](12, 2) NOT NULL,
	[CPCo_Observaciones] [varchar](100) NULL,
	[CPCo_Anulado] [bit] NULL,
	[CPCo_Saldada] [bit] NULL,
	[Usua_Creacion] [int] NOT NULL,
	[CPCo_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[CPCo_FechaModificacion] [datetime] NULL,
	[CPCo_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Vnta_tbCuentasPorCobrar_CPCo_Id] PRIMARY KEY CLUSTERED 
(
	[CPCo_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbDevoluciones]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbDevoluciones](
	[Devo_Id] [int] IDENTITY(1,1) NOT NULL,
	[Clie_Id] [int] NOT NULL,
	[Fact_Id] [int] NULL,
	[Devo_Fecha] [datetime] NOT NULL,
	[Devo_Motivo] [varchar](200) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Devo_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Devo_FechaModificacion] [datetime] NULL,
	[Devo_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Vnta_tbDevoluciones_Devo_Id] PRIMARY KEY CLUSTERED 
(
	[Devo_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbDevolucionesDetalle]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbDevolucionesDetalle](
	[DevD_Id] [int] IDENTITY(1,1) NOT NULL,
	[Devo_Id] [int] NOT NULL,
	[Prod_Id] [int] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[DevD_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[DevD_FechaModificacion] [datetime] NULL,
	[DevD_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Vnta_tbDevolucionesDetalle_DevD_Id] PRIMARY KEY CLUSTERED 
(
	[DevD_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbFacturas]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbFacturas](
	[Fact_Id] [int] IDENTITY(1,1) NOT NULL,
	[Fact_Numero] [varchar](20) NOT NULL,
	[Fact_TipoDeDocumento] [varchar](3) NOT NULL,
	[RegC_Id] [int] NOT NULL,
	[Clie_Id] [int] NOT NULL,
	[Vend_Id] [int] NOT NULL,
	[Fact_TipoVenta] [varchar](15) NULL,
	[Fact_FechaEmision] [datetime] NOT NULL,
	[Fact_FechaLimiteEmision] [datetime] NOT NULL,
	[Fact_RangoInicialAutorizado] [varchar](20) NOT NULL,
	[Fact_RangoFinalAutorizado] [varchar](20) NOT NULL,
	[Fact_TotalImpuesto15] [decimal](10, 2) NOT NULL,
	[Fact_TotalImpuesto18] [decimal](10, 2) NOT NULL,
	[Fact_ImporteExento] [decimal](12, 2) NOT NULL,
	[Fact_ImporteGravado15] [decimal](12, 2) NOT NULL,
	[Fact_ImporteGravado18] [decimal](12, 2) NOT NULL,
	[Fact_ImporteExonerado] [decimal](12, 2) NOT NULL,
	[Fact_TotalDescuento] [decimal](10, 2) NOT NULL,
	[Fact_Subtotal] [decimal](11, 2) NOT NULL,
	[Fact_Total] [decimal](11, 2) NOT NULL,
	[Fact_Latitud] [decimal](9, 6) NOT NULL,
	[Fact_Longitud] [decimal](9, 6) NOT NULL,
	[Fact_Referencia] [varchar](90) NULL,
	[Fact_AutorizadoPor] [varchar](40) NULL,
	[Fact_Anulado] [bit] NULL,
	[Fact_Usuario] [varchar](10) NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Fact_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Fact_FechaModificacion] [datetime] NULL,
	[Fact_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Vnta_tbFacturas_Fact_Id] PRIMARY KEY CLUSTERED 
(
	[Fact_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbFacturasDetalle]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbFacturasDetalle](
	[FaDe_Id] [int] IDENTITY(1,1) NOT NULL,
	[Fact_Id] [int] NOT NULL,
	[Prod_Id] [int] NOT NULL,
	[FaDe_Cantidad] [int] NOT NULL,
	[FaDe_PrecioUnitario] [decimal](13, 6) NOT NULL,
	[FaDe_Impuesto] [decimal](10, 2) NOT NULL,
	[FaDe_Descuento] [decimal](12, 2) NOT NULL,
	[FaDe_Subtotal] [decimal](12, 2) NOT NULL,
	[FaDe_Total] [decimal](12, 2) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[FaDe_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[FaDe_FechaModificacion] [datetime] NULL,
	[FaDe_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Vnta_tbFacturasDetalle_FaDe_Id] PRIMARY KEY CLUSTERED 
(
	[FaDe_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbImpuestos]    Script Date: 24/07/2025 19:41:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbImpuestos](
	[Impu_Id] [int] IDENTITY(1,1) NOT NULL,
	[Impu_Descripcion] [varchar](50) NOT NULL,
	[Impu_Valor] [numeric](6, 2) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Impu_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Impu_FechaModificacion] [datetime] NULL,
	[Impu_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Vnta_tbImpuestos_Impu_Id] PRIMARY KEY CLUSTERED 
(
	[Impu_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbPedidos]    Script Date: 24/07/2025 19:41:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbPedidos](
	[Pedi_Id] [int] IDENTITY(1,1) NOT NULL,
	[DiCl_Id] [int] NOT NULL,
	[Vend_Id] [int] NOT NULL,
	[Pedi_FechaPedido] [datetime] NOT NULL,
	[Pedi_FechaEntrega] [datetime] NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Pedi_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Pedi_FechaModificacion] [datetime] NULL,
	[Pedi_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Vnta_tbPedidos_Pedi_Id] PRIMARY KEY CLUSTERED 
(
	[Pedi_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbPedidosDetalle]    Script Date: 24/07/2025 19:41:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbPedidosDetalle](
	[PeDe_Id] [int] IDENTITY(1,1) NOT NULL,
	[Pedi_Id] [int] NOT NULL,
	[Prod_Id] [int] NOT NULL,
	[PeDe_Cantidad] [int] NOT NULL,
	[PeDe_ProdPrecio] [numeric](8, 2) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[PeDe_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[PeDe_FechaModificacion] [datetime] NULL,
	[PeDe_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Vnta_tbPedidosDetalle_PeDe_Id] PRIMARY KEY CLUSTERED 
(
	[PeDe_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbPreciosPorProducto]    Script Date: 24/07/2025 19:41:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbPreciosPorProducto](
	[PreP_Id] [int] IDENTITY(1,1) NOT NULL,
	[Prod_Id] [int] NOT NULL,
	[Clie_Id] [int] NOT NULL,
	[PreP_PrecioContado] [numeric](8, 2) NOT NULL,
	[PreP_PrecioCredito] [numeric](8, 2) NOT NULL,
	[PreP_InicioEscala] [int] NOT NULL,
	[PreP_FinEscala] [int] NOT NULL,
	[PreP_ListaPrecios] [int] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[PreP_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[PreP_FechaModificacion] [datetime] NULL,
	[PreP_Estado] [bit] NULL,
 CONSTRAINT [PK_Vnta_tbPreciosPorProducto_PreP_Id] PRIMARY KEY CLUSTERED 
(
	[PreP_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbPuntosEmision]    Script Date: 24/07/2025 19:41:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbPuntosEmision](
	[PuEm_Id] [int] IDENTITY(1,1) NOT NULL,
	[PuEm_Codigo] [varchar](10) NOT NULL,
	[PuEm_Descripcion] [varchar](100) NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[PuEm_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[PuEm_FechaModificacion] [datetime] NULL,
	[PuEm_Estado] [bit] NOT NULL,
	[Sucu_Id] [int] NULL,
 CONSTRAINT [PK_Vnta_tbPuntosEmision_PuEm_Id] PRIMARY KEY CLUSTERED 
(
	[PuEm_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbRegistrosCAI]    Script Date: 24/07/2025 19:41:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbRegistrosCAI](
	[RegC_Id] [int] IDENTITY(1,1) NOT NULL,
	[RegC_Descripcion] [varchar](100) NOT NULL,
	[Sucu_Id] [int] NULL,
	[PuEm_Id] [int] NULL,
	[NCai_Id] [int] NOT NULL,
	[RegC_RangoInicial] [varchar](30) NOT NULL,
	[RegC_RangoFinal] [varchar](30) NOT NULL,
	[RegC_FechaInicialEmision] [datetime] NOT NULL,
	[RegC_FechaFinalEmision] [datetime] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[RegC_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[RegC_FechaModificacion] [datetime] NULL,
	[RegC_Estado] [bit] NOT NULL,
 CONSTRAINT [PK_Vnta_tbRegistrosCAI_NCai_Id] PRIMARY KEY CLUSTERED 
(
	[RegC_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbVendedores]    Script Date: 24/07/2025 19:41:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbVendedores](
	[Vend_Id] [int] IDENTITY(1,1) NOT NULL,
	[Vend_Codigo] [varchar](50) NOT NULL,
	[Vend_DNI] [varchar](40) NOT NULL,
	[Vend_Nombres] [varchar](40) NOT NULL,
	[Vend_Apellidos] [varchar](40) NOT NULL,
	[Vend_Telefono] [varchar](10) NOT NULL,
	[Vend_Correo] [varchar](40) NOT NULL,
	[Vend_Sexo] [char](1) NOT NULL,
	[Vend_DireccionExacta] [varchar](100) NOT NULL,
	[Sucu_Id] [int] NOT NULL,
	[Colo_Id] [int] NOT NULL,
	[Vend_Supervisor] [int] NULL,
	[Vend_Ayudante] [int] NULL,
	[Vend_Tipo] [char](1) NULL,
	[Vend_EsExterno] [bit] NULL,
	[Vend_Estado] [bit] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Vend_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Vend_FechaModificacion] [datetime] NULL,
	[Vend_Imagen] [varchar](max) NULL,
 CONSTRAINT [PK_Vnta_tbVendedores_Vend_Id] PRIMARY KEY CLUSTERED 
(
	[Vend_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [Vnta].[tbVendedoresPorRuta]    Script Date: 24/07/2025 19:41:05 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [Vnta].[tbVendedoresPorRuta](
	[VeRu_Id] [int] IDENTITY(1,1) NOT NULL,
	[Vend_Id] [int] NOT NULL,
	[Ruta_Id] [int] NOT NULL,
	[VeRu_Dias] [varchar](15) NOT NULL,
	[Vend_Estado] [bit] NOT NULL,
	[Usua_Creacion] [int] NOT NULL,
	[Vend_FechaCreacion] [datetime] NOT NULL,
	[Usua_Modificacion] [int] NULL,
	[Vend_FechaModificacion] [datetime] NULL,
 CONSTRAINT [PK_Vnta_tbVendedoresPorRuta_VeRu_Id] PRIMARY KEY CLUSTERED 
(
	[VeRu_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__tbUsuari__9ED44AB4B049A082]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Acce].[tbUsuarios] ADD  CONSTRAINT [UQ__tbUsuari__9ED44AB4B049A082] UNIQUE NONCLUSTERED 
(
	[Usua_Usuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tbClientes_Clie_Codigo]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Gral].[tbClientes] ADD  CONSTRAINT [UQ_tbClientes_Clie_Codigo] UNIQUE NONCLUSTERED 
(
	[Clie_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ__tbEmplea__40E62F3A78D3E75E]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Gral].[tbEmpleados] ADD  CONSTRAINT [UQ__tbEmplea__40E62F3A78D3E75E] UNIQUE NONCLUSTERED 
(
	[Empl_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tbEmpleados_Empl_Codigo]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Gral].[tbEmpleados] ADD  CONSTRAINT [UQ_tbEmpleados_Empl_Codigo] UNIQUE NONCLUSTERED 
(
	[Empl_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tbProveedores_Prov_Codigo]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Gral].[tbProveedores] ADD  CONSTRAINT [UQ_tbProveedores_Prov_Codigo] UNIQUE NONCLUSTERED 
(
	[Prov_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tbProductos_Prod_Codigo]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Inve].[tbProductos] ADD  CONSTRAINT [UQ_tbProductos_Prod_Codigo] UNIQUE NONCLUSTERED 
(
	[Prod_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tbProductos_Prod_CodigoBarra]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Inve].[tbProductos] ADD  CONSTRAINT [UQ_tbProductos_Prod_CodigoBarra] UNIQUE NONCLUSTERED 
(
	[Prod_CodigoBarra] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tbRutas_Ruta_Codigo]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Logi].[tbRutas] ADD  CONSTRAINT [UQ_tbRutas_Ruta_Codigo] UNIQUE NONCLUSTERED 
(
	[Ruta_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tbCAIs_NCai_Codigo]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Vnta].[tbCAIs] ADD  CONSTRAINT [UQ_tbCAIs_NCai_Codigo] UNIQUE NONCLUSTERED 
(
	[NCai_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tbConfiguracionFacturas_CoFa_RTN]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Vnta].[tbConfiguracionFacturas] ADD  CONSTRAINT [UQ_tbConfiguracionFacturas_CoFa_RTN] UNIQUE NONCLUSTERED 
(
	[CoFa_RTN] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tbPuntosEmision_PuEm_Codigo]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Vnta].[tbPuntosEmision] ADD  CONSTRAINT [UQ_tbPuntosEmision_PuEm_Codigo] UNIQUE NONCLUSTERED 
(
	[PuEm_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UQ_tbVendedores_Vend_Codigo]    Script Date: 24/07/2025 19:41:06 ******/
ALTER TABLE [Vnta].[tbVendedores] ADD  CONSTRAINT [UQ_tbVendedores_Vend_Codigo] UNIQUE NONCLUSTERED 
(
	[Vend_Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [Acce].[tbPantallas] ADD  CONSTRAINT [DF__tbPantall__Pant___1F98B2C1]  DEFAULT ((0)) FOR [Pant_EsPadre]
GO
ALTER TABLE [Acce].[tbRoles] ADD  DEFAULT ((1)) FOR [Role_Estado]
GO
ALTER TABLE [Acce].[tbUsuarios] ADD  CONSTRAINT [DF__tbUsuario__Usua___38996AB5]  DEFAULT ((1)) FOR [Usua_EsAdmin]
GO
ALTER TABLE [Acce].[tbUsuarios] ADD  CONSTRAINT [DF__tbUsuario__Usua___398D8EEE]  DEFAULT ((1)) FOR [Usua_Estado]
GO
ALTER TABLE [Gral].[tbAvales] ADD  DEFAULT ((1)) FOR [Aval_Estado]
GO
ALTER TABLE [Gral].[tbCanales] ADD  DEFAULT ((1)) FOR [Cana_Estado]
GO
ALTER TABLE [Gral].[tbCargos] ADD  DEFAULT ((1)) FOR [Carg_Estado]
GO
ALTER TABLE [Gral].[tbClientes] ADD  CONSTRAINT [DF__tbCliente__Clie___395884C4]  DEFAULT ((0)) FOR [Clie_Vencido]
GO
ALTER TABLE [Gral].[tbClientes] ADD  CONSTRAINT [DF_tbClientes_Clie_Confirmacion]  DEFAULT ((0)) FOR [Clie_Confirmacion]
GO
ALTER TABLE [Gral].[tbClientes] ADD  CONSTRAINT [DF__tbCliente__Clie___3A4CA8FD]  DEFAULT ((1)) FOR [Clie_Estado]
GO
ALTER TABLE [Gral].[tbEmpleados] ADD  CONSTRAINT [DF__tbEmplead__Empl___00200768]  DEFAULT ((1)) FOR [Empl_Estado]
GO
ALTER TABLE [Gral].[tbMarcas] ADD  DEFAULT ((1)) FOR [Marc_Estado]
GO
ALTER TABLE [Gral].[tbMarcasVehiculos] ADD  DEFAULT ((1)) FOR [MaVe_Estado]
GO
ALTER TABLE [Gral].[tbModelos] ADD  DEFAULT ((1)) FOR [Mode_Estado]
GO
ALTER TABLE [Gral].[tbProveedores] ADD  DEFAULT ((1)) FOR [Prov_Estado]
GO
ALTER TABLE [Gral].[tbSucursales] ADD  DEFAULT ((1)) FOR [Sucu_Estado]
GO
ALTER TABLE [Gral].[tbTiposDeVivienda] ADD  DEFAULT ((1)) FOR [TiVi_Estado]
GO
ALTER TABLE [Inve].[tbCategorias] ADD  DEFAULT ((1)) FOR [Cate_Estado]
GO
ALTER TABLE [Inve].[tbDescuentoPorClientes] ADD  DEFAULT ((1)) FOR [DeCl_Estado]
GO
ALTER TABLE [Inve].[tbDescuentos] ADD  DEFAULT ((1)) FOR [Desc_Estado]
GO
ALTER TABLE [Inve].[tbDescuentosDetalle] ADD  DEFAULT ((1)) FOR [DesD_Estado]
GO
ALTER TABLE [Inve].[tbDescuentosPorEscala] ADD  DEFAULT ((1)) FOR [DeEs_Estado]
GO
ALTER TABLE [Inve].[tbInventarioBodegas] ADD  DEFAULT ((1)) FOR [InBo_Estado]
GO
ALTER TABLE [Inve].[tbInventarioSucursales] ADD  DEFAULT ((1)) FOR [InSu_Estado]
GO
ALTER TABLE [Inve].[tbProductos] ADD  CONSTRAINT [DF__tbProduct__Prod___58D1301D]  DEFAULT ((1)) FOR [Prod_Estado]
GO
ALTER TABLE [Inve].[tbPromociones] ADD  DEFAULT ('N/A') FOR [Muni_Codigo]
GO
ALTER TABLE [Inve].[tbPromociones] ADD  DEFAULT ((1)) FOR [Prom_Estado]
GO
ALTER TABLE [Inve].[tbPromocionesDetalle] ADD  DEFAULT ((1)) FOR [PrDe_Estado]
GO
ALTER TABLE [Inve].[tbSubcategorias] ADD  DEFAULT ((1)) FOR [Subc_Estado]
GO
ALTER TABLE [Logi].[tbBodegas] ADD  CONSTRAINT [DF_tbBodegas_Bode_Estado]  DEFAULT ((1)) FOR [Bode_Estado]
GO
ALTER TABLE [Logi].[tbRecargas] ADD  DEFAULT ((1)) FOR [Reca_Estado]
GO
ALTER TABLE [Logi].[tbRutas] ADD  DEFAULT ((1)) FOR [Ruta_Estado]
GO
ALTER TABLE [Logi].[tbTraslados] ADD  DEFAULT ((1)) FOR [Tras_Estado]
GO
ALTER TABLE [Vnta].[tbCAIs] ADD  DEFAULT ((1)) FOR [NCai_Estado]
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar] ADD  DEFAULT ((0)) FOR [CPCo_Anulado]
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar] ADD  DEFAULT ((0)) FOR [CPCo_Saldada]
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar] ADD  DEFAULT ((1)) FOR [CPCo_Estado]
GO
ALTER TABLE [Vnta].[tbDevoluciones] ADD  DEFAULT ((1)) FOR [Devo_Estado]
GO
ALTER TABLE [Vnta].[tbDevolucionesDetalle] ADD  DEFAULT ((1)) FOR [DevD_Estado]
GO
ALTER TABLE [Vnta].[tbFacturas] ADD  DEFAULT ((0)) FOR [Fact_Anulado]
GO
ALTER TABLE [Vnta].[tbFacturas] ADD  DEFAULT ((1)) FOR [Fact_Estado]
GO
ALTER TABLE [Vnta].[tbFacturasDetalle] ADD  DEFAULT ((1)) FOR [FaDe_Estado]
GO
ALTER TABLE [Vnta].[tbImpuestos] ADD  DEFAULT ((1)) FOR [Impu_Estado]
GO
ALTER TABLE [Vnta].[tbPedidos] ADD  CONSTRAINT [DF__tbPedidos__Pedi___46B27FE2]  DEFAULT ((1)) FOR [Pedi_Estado]
GO
ALTER TABLE [Vnta].[tbPedidosDetalle] ADD  DEFAULT ((1)) FOR [PeDe_Estado]
GO
ALTER TABLE [Vnta].[tbPreciosPorProducto] ADD  DEFAULT ((1)) FOR [PreP_Estado]
GO
ALTER TABLE [Vnta].[tbPuntosEmision] ADD  DEFAULT ((1)) FOR [PuEm_Estado]
GO
ALTER TABLE [Vnta].[tbRegistrosCAI] ADD  DEFAULT ((1)) FOR [RegC_Estado]
GO
ALTER TABLE [Vnta].[tbVendedores] ADD  DEFAULT ((0)) FOR [Vend_EsExterno]
GO
ALTER TABLE [Vnta].[tbVendedores] ADD  DEFAULT ((1)) FOR [Vend_Estado]
GO
ALTER TABLE [Vnta].[tbVendedoresPorRuta] ADD  CONSTRAINT [DF__tbVendedo__Vend___2BFE89A6]  DEFAULT ((1)) FOR [Vend_Estado]
GO
ALTER TABLE [Acce].[tbAccionesPorPantalla]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbAccionesPorPantalla_Acce_tbAcciones_Acci_Id] FOREIGN KEY([Acci_Id])
REFERENCES [Acce].[tbAcciones] ([Acci_Id])
GO
ALTER TABLE [Acce].[tbAccionesPorPantalla] CHECK CONSTRAINT [FK_Acce_tbAccionesPorPantalla_Acce_tbAcciones_Acci_Id]
GO
ALTER TABLE [Acce].[tbAccionesPorPantalla]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbAccionesPorPantalla_Acce_tbPantallas_Pant_Id] FOREIGN KEY([Pant_Id])
REFERENCES [Acce].[tbPantallas] ([Pant_Id])
GO
ALTER TABLE [Acce].[tbAccionesPorPantalla] CHECK CONSTRAINT [FK_Acce_tbAccionesPorPantalla_Acce_tbPantallas_Pant_Id]
GO
ALTER TABLE [Acce].[tbPantallas]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbPantallas_Pant_Padre_Acce_tbPantallas_Pant_Id] FOREIGN KEY([Pant_Padre])
REFERENCES [Acce].[tbPantallas] ([Pant_Id])
GO
ALTER TABLE [Acce].[tbPantallas] CHECK CONSTRAINT [FK_Acce_tbPantallas_Pant_Padre_Acce_tbPantallas_Pant_Id]
GO
ALTER TABLE [Acce].[tbPermisos]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbPermisos_Acce_tbAccionesPorPantalla_AcPa_Id] FOREIGN KEY([AcPa_Id])
REFERENCES [Acce].[tbAccionesPorPantalla] ([AcPa_Id])
GO
ALTER TABLE [Acce].[tbPermisos] CHECK CONSTRAINT [FK_Acce_tbPermisos_Acce_tbAccionesPorPantalla_AcPa_Id]
GO
ALTER TABLE [Acce].[tbPermisos]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbPermisos_Acce_tbRoles_Role_Id] FOREIGN KEY([Role_Id])
REFERENCES [Acce].[tbRoles] ([Role_Id])
GO
ALTER TABLE [Acce].[tbPermisos] CHECK CONSTRAINT [FK_Acce_tbPermisos_Acce_tbRoles_Role_Id]
GO
ALTER TABLE [Acce].[tbPermisos]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbPermisos_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Acce].[tbPermisos] CHECK CONSTRAINT [FK_Acce_tbPermisos_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Acce].[tbPermisos]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbPermisos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Acce].[tbPermisos] CHECK CONSTRAINT [FK_Acce_tbPermisos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Acce].[tbRoles]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbRoles_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Acce].[tbRoles] CHECK CONSTRAINT [FK_Acce_tbRoles_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Acce].[tbRoles]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbRoles_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Acce].[tbRoles] CHECK CONSTRAINT [FK_Acce_tbRoles_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Acce].[tbUsuarios]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbUsuarios_Acce_tbRoles_Role_Id] FOREIGN KEY([Role_Id])
REFERENCES [Acce].[tbRoles] ([Role_Id])
GO
ALTER TABLE [Acce].[tbUsuarios] CHECK CONSTRAINT [FK_Acce_tbUsuarios_Acce_tbRoles_Role_Id]
GO
ALTER TABLE [Acce].[tbUsuarios]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbUsuarios_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Acce].[tbUsuarios] CHECK CONSTRAINT [FK_Acce_tbUsuarios_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Acce].[tbUsuarios]  WITH CHECK ADD  CONSTRAINT [FK_Acce_tbUsuarios_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Acce].[tbUsuarios] CHECK CONSTRAINT [FK_Acce_tbUsuarios_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbAvales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbAvales_Gral_tbClientes_Clie_Id] FOREIGN KEY([Clie_Id])
REFERENCES [Gral].[tbClientes] ([Clie_Id])
GO
ALTER TABLE [Gral].[tbAvales] CHECK CONSTRAINT [FK_Gral_tbAvales_Gral_tbClientes_Clie_Id]
GO
ALTER TABLE [Gral].[tbAvales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbAvales_Gral_tbColonias_Colo_Id] FOREIGN KEY([Colo_Id])
REFERENCES [Gral].[tbColonias] ([Colo_Id])
GO
ALTER TABLE [Gral].[tbAvales] CHECK CONSTRAINT [FK_Gral_tbAvales_Gral_tbColonias_Colo_Id]
GO
ALTER TABLE [Gral].[tbAvales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbAvales_Gral_tbEstadosCiviles_EsCv_Id] FOREIGN KEY([EsCv_Id])
REFERENCES [Gral].[tbEstadosCiviles] ([EsCv_Id])
GO
ALTER TABLE [Gral].[tbAvales] CHECK CONSTRAINT [FK_Gral_tbAvales_Gral_tbEstadosCiviles_EsCv_Id]
GO
ALTER TABLE [Gral].[tbAvales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbAvales_Gral_tbTiposDeVivienda_TiVi_Id] FOREIGN KEY([TiVi_Id])
REFERENCES [Gral].[tbTiposDeVivienda] ([TiVi_Id])
GO
ALTER TABLE [Gral].[tbAvales] CHECK CONSTRAINT [FK_Gral_tbAvales_Gral_tbTiposDeVivienda_TiVi_Id]
GO
ALTER TABLE [Gral].[tbAvales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbAvales_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbAvales] CHECK CONSTRAINT [FK_Gral_tbAvales_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbAvales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbAvales_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbAvales] CHECK CONSTRAINT [FK_Gral_tbAvales_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbCanales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbCanales_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbCanales] CHECK CONSTRAINT [FK_Gral_tbCanales_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbCanales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbCanales_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbCanales] CHECK CONSTRAINT [FK_Gral_tbCanales_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbCargos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbCargos_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbCargos] CHECK CONSTRAINT [FK_Gral_tbCargos_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbCargos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbCargos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbCargos] CHECK CONSTRAINT [FK_Gral_tbCargos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbClientes]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbClientes_Clie_Nacionalidad_Gral_tbPaises_Pais_Codigo] FOREIGN KEY([Clie_Nacionalidad])
REFERENCES [Gral].[tbPaises] ([Pais_Codigo])
GO
ALTER TABLE [Gral].[tbClientes] CHECK CONSTRAINT [FK_Gral_tbClientes_Clie_Nacionalidad_Gral_tbPaises_Pais_Codigo]
GO
ALTER TABLE [Gral].[tbClientes]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbClientes_Gral_tbCanales_Cana_Id] FOREIGN KEY([Cana_Id])
REFERENCES [Gral].[tbCanales] ([Cana_Id])
GO
ALTER TABLE [Gral].[tbClientes] CHECK CONSTRAINT [FK_Gral_tbClientes_Gral_tbCanales_Cana_Id]
GO
ALTER TABLE [Gral].[tbClientes]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbClientes_Gral_tbEstadosCiviles_EsCv_Id] FOREIGN KEY([EsCv_Id])
REFERENCES [Gral].[tbEstadosCiviles] ([EsCv_Id])
GO
ALTER TABLE [Gral].[tbClientes] CHECK CONSTRAINT [FK_Gral_tbClientes_Gral_tbEstadosCiviles_EsCv_Id]
GO
ALTER TABLE [Gral].[tbClientes]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbClientes_Gral_tbTiposDeVivienda_TiVi_Id] FOREIGN KEY([TiVi_Id])
REFERENCES [Gral].[tbTiposDeVivienda] ([TiVi_Id])
GO
ALTER TABLE [Gral].[tbClientes] CHECK CONSTRAINT [FK_Gral_tbClientes_Gral_tbTiposDeVivienda_TiVi_Id]
GO
ALTER TABLE [Gral].[tbClientes]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbClientes_Logi_tbRutas_Ruta_Id] FOREIGN KEY([Ruta_Id])
REFERENCES [Logi].[tbRutas] ([Ruta_Id])
GO
ALTER TABLE [Gral].[tbClientes] CHECK CONSTRAINT [FK_Gral_tbClientes_Logi_tbRutas_Ruta_Id]
GO
ALTER TABLE [Gral].[tbClientes]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbClientes_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbClientes] CHECK CONSTRAINT [FK_Gral_tbClientes_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbClientes]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbClientes_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbClientes] CHECK CONSTRAINT [FK_Gral_tbClientes_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbColonias]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbColonias_Gral_tbMunicipios_Muni_Codigo] FOREIGN KEY([Muni_Codigo])
REFERENCES [Gral].[tbMunicipios] ([Muni_Codigo])
GO
ALTER TABLE [Gral].[tbColonias] CHECK CONSTRAINT [FK_Gral_tbColonias_Gral_tbMunicipios_Muni_Codigo]
GO
ALTER TABLE [Gral].[tbColonias]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbColonias_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbColonias] CHECK CONSTRAINT [FK_Gral_tbColonias_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbColonias]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbColonias_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbColonias] CHECK CONSTRAINT [FK_Gral_tbColonias_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbDepartamentos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbDepartamentos_Gral_tbPaises_Pais_Codigo] FOREIGN KEY([Pais_Codigo])
REFERENCES [Gral].[tbPaises] ([Pais_Codigo])
GO
ALTER TABLE [Gral].[tbDepartamentos] CHECK CONSTRAINT [FK_Gral_tbDepartamentos_Gral_tbPaises_Pais_Codigo]
GO
ALTER TABLE [Gral].[tbDepartamentos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbDepartamentos_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbDepartamentos] CHECK CONSTRAINT [FK_Gral_tbDepartamentos_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbDepartamentos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbDepartamentos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbDepartamentos] CHECK CONSTRAINT [FK_Gral_tbDepartamentos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbDireccionesPorCliente]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbDireccionesPorCliente_tbClientes_Clie_Id] FOREIGN KEY([Clie_Id])
REFERENCES [Gral].[tbClientes] ([Clie_Id])
GO
ALTER TABLE [Gral].[tbDireccionesPorCliente] CHECK CONSTRAINT [FK_Gral_tbDireccionesPorCliente_tbClientes_Clie_Id]
GO
ALTER TABLE [Gral].[tbDireccionesPorCliente]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbDireccionesPorCliente_tbColonias_Colo_Id] FOREIGN KEY([Colo_Id])
REFERENCES [Gral].[tbColonias] ([Colo_Id])
GO
ALTER TABLE [Gral].[tbDireccionesPorCliente] CHECK CONSTRAINT [FK_Gral_tbDireccionesPorCliente_tbColonias_Colo_Id]
GO
ALTER TABLE [Gral].[tbDireccionesPorCliente]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbDireccionesPorCliente_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbDireccionesPorCliente] CHECK CONSTRAINT [FK_Gral_tbDireccionesPorCliente_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbDireccionesPorCliente]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbDireccionesPorCliente_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbDireccionesPorCliente] CHECK CONSTRAINT [FK_Gral_tbDireccionesPorCliente_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbEmpleados]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbEmpleados_Gral_tbCargos_Carg_Id] FOREIGN KEY([Carg_Id])
REFERENCES [Gral].[tbCargos] ([Carg_Id])
GO
ALTER TABLE [Gral].[tbEmpleados] CHECK CONSTRAINT [FK_Gral_tbEmpleados_Gral_tbCargos_Carg_Id]
GO
ALTER TABLE [Gral].[tbEmpleados]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbEmpleados_Gral_tbColonias_Colo_Id] FOREIGN KEY([Colo_Id])
REFERENCES [Gral].[tbColonias] ([Colo_Id])
GO
ALTER TABLE [Gral].[tbEmpleados] CHECK CONSTRAINT [FK_Gral_tbEmpleados_Gral_tbColonias_Colo_Id]
GO
ALTER TABLE [Gral].[tbEmpleados]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbEmpleados_Gral_tbEstadosCiviles_EsCv_Id] FOREIGN KEY([EsCv_Id])
REFERENCES [Gral].[tbEstadosCiviles] ([EsCv_Id])
GO
ALTER TABLE [Gral].[tbEmpleados] CHECK CONSTRAINT [FK_Gral_tbEmpleados_Gral_tbEstadosCiviles_EsCv_Id]
GO
ALTER TABLE [Gral].[tbEmpleados]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbEmpleados_Gral_tbSucursales_Sucu_Id] FOREIGN KEY([Sucu_Id])
REFERENCES [Gral].[tbSucursales] ([Sucu_Id])
GO
ALTER TABLE [Gral].[tbEmpleados] CHECK CONSTRAINT [FK_Gral_tbEmpleados_Gral_tbSucursales_Sucu_Id]
GO
ALTER TABLE [Gral].[tbEmpleados]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbEmpleados_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbEmpleados] CHECK CONSTRAINT [FK_Gral_tbEmpleados_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbEmpleados]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbEmpleados_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbEmpleados] CHECK CONSTRAINT [FK_Gral_tbEmpleados_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbEstadosCiviles]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbEstadosCiviles_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbEstadosCiviles] CHECK CONSTRAINT [FK_Gral_tbEstadosCiviles_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbEstadosCiviles]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbEstadosCiviles_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbEstadosCiviles] CHECK CONSTRAINT [FK_Gral_tbEstadosCiviles_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbMarcas]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbMarcas_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbMarcas] CHECK CONSTRAINT [FK_Gral_tbMarcas_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbMarcas]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbMarcas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbMarcas] CHECK CONSTRAINT [FK_Gral_tbMarcas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbMarcasVehiculos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbMarcasVehiculos_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbMarcasVehiculos] CHECK CONSTRAINT [FK_Gral_tbMarcasVehiculos_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbMarcasVehiculos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbMarcasVehiculos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbMarcasVehiculos] CHECK CONSTRAINT [FK_Gral_tbMarcasVehiculos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbModelos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbModelos_Gral_tbMarcasVehiculos_MaVe_Id] FOREIGN KEY([MaVe_Id])
REFERENCES [Gral].[tbMarcasVehiculos] ([MaVe_Id])
GO
ALTER TABLE [Gral].[tbModelos] CHECK CONSTRAINT [FK_Gral_tbModelos_Gral_tbMarcasVehiculos_MaVe_Id]
GO
ALTER TABLE [Gral].[tbModelos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbModelos_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbModelos] CHECK CONSTRAINT [FK_Gral_tbModelos_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbModelos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbModelos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbModelos] CHECK CONSTRAINT [FK_Gral_tbModelos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbMunicipios]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbMunicipios_Gral_tbDepartamentos_Dep_Codigo] FOREIGN KEY([Depa_Codigo])
REFERENCES [Gral].[tbDepartamentos] ([Depa_Codigo])
GO
ALTER TABLE [Gral].[tbMunicipios] CHECK CONSTRAINT [FK_Gral_tbMunicipios_Gral_tbDepartamentos_Dep_Codigo]
GO
ALTER TABLE [Gral].[tbMunicipios]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbMunicipios_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbMunicipios] CHECK CONSTRAINT [FK_Gral_tbMunicipios_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbMunicipios]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbMunicipios_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbMunicipios] CHECK CONSTRAINT [FK_Gral_tbMunicipios_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbPaises]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbPaises_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbPaises] CHECK CONSTRAINT [FK_Gral_tbPaises_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbPaises]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbPaises_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbPaises] CHECK CONSTRAINT [FK_Gral_tbPaises_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbProveedores]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbProveedores_Gral_tbColonias_Colo_Id] FOREIGN KEY([Colo_Id])
REFERENCES [Gral].[tbColonias] ([Colo_Id])
GO
ALTER TABLE [Gral].[tbProveedores] CHECK CONSTRAINT [FK_Gral_tbProveedores_Gral_tbColonias_Colo_Id]
GO
ALTER TABLE [Gral].[tbProveedores]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbProveedores_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbProveedores] CHECK CONSTRAINT [FK_Gral_tbProveedores_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbProveedores]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbProveedores_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbProveedores] CHECK CONSTRAINT [FK_Gral_tbProveedores_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbSucursales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbSucursales_Gral_tbColonias_Colo_Id] FOREIGN KEY([Colo_Id])
REFERENCES [Gral].[tbColonias] ([Colo_Id])
GO
ALTER TABLE [Gral].[tbSucursales] CHECK CONSTRAINT [FK_Gral_tbSucursales_Gral_tbColonias_Colo_Id]
GO
ALTER TABLE [Gral].[tbSucursales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbSucursales_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbSucursales] CHECK CONSTRAINT [FK_Gral_tbSucursales_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbSucursales]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbSucursales_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbSucursales] CHECK CONSTRAINT [FK_Gral_tbSucursales_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbTiposDeVivienda]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbTiposDeVivienda_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbTiposDeVivienda] CHECK CONSTRAINT [FK_Gral_tbTiposDeVivienda_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Gral].[tbTiposDeVivienda]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbTiposDeVivienda_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Gral].[tbTiposDeVivienda] CHECK CONSTRAINT [FK_Gral_tbTiposDeVivienda_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbCategorias]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbCategorias_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbCategorias] CHECK CONSTRAINT [FK_Inve_tbCategorias_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbCategorias]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbCategorias_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbCategorias] CHECK CONSTRAINT [FK_Inve_tbCategorias_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbDescuentoPorClientes]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentoPorClientes_Desc_Id_Gral_tbClientes_Clie_Id] FOREIGN KEY([Clie_Id])
REFERENCES [Gral].[tbClientes] ([Clie_Id])
GO
ALTER TABLE [Inve].[tbDescuentoPorClientes] CHECK CONSTRAINT [FK_Inve_tbDescuentoPorClientes_Desc_Id_Gral_tbClientes_Clie_Id]
GO
ALTER TABLE [Inve].[tbDescuentoPorClientes]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentoPorClientes_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbDescuentoPorClientes] CHECK CONSTRAINT [FK_Inve_tbDescuentoPorClientes_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbDescuentoPorClientes]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentoPorClientes_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbDescuentoPorClientes] CHECK CONSTRAINT [FK_Inve_tbDescuentoPorClientes_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbDescuentoPorClientes]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentosPorClientes_Desc_Id_Inve_tbDescuentos_Desc_Id] FOREIGN KEY([Desc_Id])
REFERENCES [Inve].[tbDescuentos] ([Desc_Id])
GO
ALTER TABLE [Inve].[tbDescuentoPorClientes] CHECK CONSTRAINT [FK_Inve_tbDescuentosPorClientes_Desc_Id_Inve_tbDescuentos_Desc_Id]
GO
ALTER TABLE [Inve].[tbDescuentos]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentos_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbDescuentos] CHECK CONSTRAINT [FK_Inve_tbDescuentos_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbDescuentos]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbDescuentos] CHECK CONSTRAINT [FK_Inve_tbDescuentos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbDescuentosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentosDetalle_Inve_tbDescuentos_Desc_Id] FOREIGN KEY([Desc_Id])
REFERENCES [Inve].[tbDescuentos] ([Desc_Id])
GO
ALTER TABLE [Inve].[tbDescuentosDetalle] CHECK CONSTRAINT [FK_Inve_tbDescuentosDetalle_Inve_tbDescuentos_Desc_Id]
GO
ALTER TABLE [Inve].[tbDescuentosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentosDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbDescuentosDetalle] CHECK CONSTRAINT [FK_Inve_tbDescuentosDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbDescuentosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentosDetalle_Usua_Modificacion_Acce_tbUsuario_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbDescuentosDetalle] CHECK CONSTRAINT [FK_Inve_tbDescuentosDetalle_Usua_Modificacion_Acce_tbUsuario_Usua_Id]
GO
ALTER TABLE [Inve].[tbDescuentosPorEscala]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentosPorEscala_Desc_Id_Inve_tbDescuentos_Desc_Id] FOREIGN KEY([Desc_Id])
REFERENCES [Inve].[tbDescuentos] ([Desc_Id])
GO
ALTER TABLE [Inve].[tbDescuentosPorEscala] CHECK CONSTRAINT [FK_Inve_tbDescuentosPorEscala_Desc_Id_Inve_tbDescuentos_Desc_Id]
GO
ALTER TABLE [Inve].[tbDescuentosPorEscala]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentosPorEscala_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbDescuentosPorEscala] CHECK CONSTRAINT [FK_Inve_tbDescuentosPorEscala_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbDescuentosPorEscala]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbDescuentosPorEscala_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbDescuentosPorEscala] CHECK CONSTRAINT [FK_Inve_tbDescuentosPorEscala_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbInventarioBodegas]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbInventarioBodegas_Bode_Id] FOREIGN KEY([Bode_Id])
REFERENCES [Logi].[tbBodegas] ([Bode_Id])
GO
ALTER TABLE [Inve].[tbInventarioBodegas] CHECK CONSTRAINT [FK_Inve_tbInventarioBodegas_Bode_Id]
GO
ALTER TABLE [Inve].[tbInventarioBodegas]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbInventarioBodegas_Gral_Prod_Id] FOREIGN KEY([Prod_Id])
REFERENCES [Inve].[tbProductos] ([Prod_Id])
GO
ALTER TABLE [Inve].[tbInventarioBodegas] CHECK CONSTRAINT [FK_Inve_tbInventarioBodegas_Gral_Prod_Id]
GO
ALTER TABLE [Inve].[tbInventarioBodegas]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbInventarioBodegas_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbInventarioBodegas] CHECK CONSTRAINT [FK_Inve_tbInventarioBodegas_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbInventarioBodegas]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbInventarioBodegas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbInventarioBodegas] CHECK CONSTRAINT [FK_Inve_tbInventarioBodegas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbInventarioSucursales]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbInventarioSucursales_Gral_tbSucursales_Sucu_Id] FOREIGN KEY([Sucu_Id])
REFERENCES [Gral].[tbSucursales] ([Sucu_Id])
GO
ALTER TABLE [Inve].[tbInventarioSucursales] CHECK CONSTRAINT [FK_Inve_tbInventarioSucursales_Gral_tbSucursales_Sucu_Id]
GO
ALTER TABLE [Inve].[tbInventarioSucursales]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbInventarioSucursales_Inve_tbProductos_Prod_Id] FOREIGN KEY([Prod_Id])
REFERENCES [Inve].[tbProductos] ([Prod_Id])
GO
ALTER TABLE [Inve].[tbInventarioSucursales] CHECK CONSTRAINT [FK_Inve_tbInventarioSucursales_Inve_tbProductos_Prod_Id]
GO
ALTER TABLE [Inve].[tbInventarioSucursales]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbInventarioSucursales_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbInventarioSucursales] CHECK CONSTRAINT [FK_Inve_tbInventarioSucursales_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbInventarioSucursales]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbInventarioSucursales_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbInventarioSucursales] CHECK CONSTRAINT [FK_Inve_tbInventarioSucursales_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbProductos]  WITH CHECK ADD  CONSTRAINT [FK_Gral_tbProductos_Gral_tbProveedores_Prov_Id] FOREIGN KEY([Prov_Id])
REFERENCES [Gral].[tbProveedores] ([Prov_Id])
GO
ALTER TABLE [Inve].[tbProductos] CHECK CONSTRAINT [FK_Gral_tbProductos_Gral_tbProveedores_Prov_Id]
GO
ALTER TABLE [Inve].[tbProductos]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbProductos_Gral_tbMarcas_Marc_Id] FOREIGN KEY([Marc_Id])
REFERENCES [Gral].[tbMarcas] ([Marc_Id])
GO
ALTER TABLE [Inve].[tbProductos] CHECK CONSTRAINT [FK_Inve_tbProductos_Gral_tbMarcas_Marc_Id]
GO
ALTER TABLE [Inve].[tbProductos]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbProductos_Inve_tbSubcategorias_Subc_Id] FOREIGN KEY([Subc_Id])
REFERENCES [Inve].[tbSubcategorias] ([Subc_Id])
GO
ALTER TABLE [Inve].[tbProductos] CHECK CONSTRAINT [FK_Inve_tbProductos_Inve_tbSubcategorias_Subc_Id]
GO
ALTER TABLE [Inve].[tbProductos]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbProductos_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbProductos] CHECK CONSTRAINT [FK_Inve_tbProductos_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbProductos]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbProductos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbProductos] CHECK CONSTRAINT [FK_Inve_tbProductos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbProductos]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbProductos_Vnta_tbImpuestos_Impu_Id] FOREIGN KEY([Impu_Id])
REFERENCES [Vnta].[tbImpuestos] ([Impu_Id])
GO
ALTER TABLE [Inve].[tbProductos] CHECK CONSTRAINT [FK_Inve_tbProductos_Vnta_tbImpuestos_Impu_Id]
GO
ALTER TABLE [Inve].[tbPromociones]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbPromociones_Gral_tbMunicipios_Muni_Codigo] FOREIGN KEY([Muni_Codigo])
REFERENCES [Gral].[tbMunicipios] ([Muni_Codigo])
GO
ALTER TABLE [Inve].[tbPromociones] CHECK CONSTRAINT [FK_Inve_tbPromociones_Gral_tbMunicipios_Muni_Codigo]
GO
ALTER TABLE [Inve].[tbPromociones]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbPromociones_Gral_tbSucursales_Sucu_Id] FOREIGN KEY([Sucu_Id])
REFERENCES [Gral].[tbSucursales] ([Sucu_Id])
GO
ALTER TABLE [Inve].[tbPromociones] CHECK CONSTRAINT [FK_Inve_tbPromociones_Gral_tbSucursales_Sucu_Id]
GO
ALTER TABLE [Inve].[tbPromociones]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbPromociones_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbPromociones] CHECK CONSTRAINT [FK_Inve_tbPromociones_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbPromociones]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbPromociones_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbPromociones] CHECK CONSTRAINT [FK_Inve_tbPromociones_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbPromocionesDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbPromocionesDetalle_Inve_tbPromociones_Prom_Id] FOREIGN KEY([Prom_Id])
REFERENCES [Inve].[tbPromociones] ([Prom_Id])
GO
ALTER TABLE [Inve].[tbPromocionesDetalle] CHECK CONSTRAINT [FK_Inve_tbPromocionesDetalle_Inve_tbPromociones_Prom_Id]
GO
ALTER TABLE [Inve].[tbPromocionesDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbPromocionesDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbPromocionesDetalle] CHECK CONSTRAINT [FK_Inve_tbPromocionesDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbPromocionesDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbPromocionesDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbPromocionesDetalle] CHECK CONSTRAINT [FK_Inve_tbPromocionesDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbSubcategorias]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbSubcategorias_tbCategorias_Cate_Id] FOREIGN KEY([Cate_Id])
REFERENCES [Inve].[tbCategorias] ([Cate_Id])
GO
ALTER TABLE [Inve].[tbSubcategorias] CHECK CONSTRAINT [FK_Inve_tbSubcategorias_tbCategorias_Cate_Id]
GO
ALTER TABLE [Inve].[tbSubcategorias]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbSubcategorias_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbSubcategorias] CHECK CONSTRAINT [FK_Inve_tbSubcategorias_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Inve].[tbSubcategorias]  WITH CHECK ADD  CONSTRAINT [FK_Inve_tbSubcategorias_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Inve].[tbSubcategorias] CHECK CONSTRAINT [FK_Inve_tbSubcategorias_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbBodegas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbBodegas_Gral_tbModelos_Mode_Id] FOREIGN KEY([Mode_Id])
REFERENCES [Gral].[tbModelos] ([Mode_Id])
GO
ALTER TABLE [Logi].[tbBodegas] CHECK CONSTRAINT [FK_Logi_tbBodegas_Gral_tbModelos_Mode_Id]
GO
ALTER TABLE [Logi].[tbBodegas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbBodegas_Gral_tbSucursales_Sucu_Id] FOREIGN KEY([Sucu_Id])
REFERENCES [Gral].[tbSucursales] ([Sucu_Id])
GO
ALTER TABLE [Logi].[tbBodegas] CHECK CONSTRAINT [FK_Logi_tbBodegas_Gral_tbSucursales_Sucu_Id]
GO
ALTER TABLE [Logi].[tbBodegas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbBodegas_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbBodegas] CHECK CONSTRAINT [FK_Logi_tbBodegas_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbBodegas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbBodegas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbBodegas] CHECK CONSTRAINT [FK_Logi_tbBodegas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbBodegas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbBodegas_Vnta_tbRegistrosCAI_RegC_Id] FOREIGN KEY([RegC_Id])
REFERENCES [Vnta].[tbRegistrosCAI] ([RegC_Id])
GO
ALTER TABLE [Logi].[tbBodegas] CHECK CONSTRAINT [FK_Logi_tbBodegas_Vnta_tbRegistrosCAI_RegC_Id]
GO
ALTER TABLE [Logi].[tbBodegas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbBodegas_Vnta_tbVendedores_Vend_Id] FOREIGN KEY([Vend_Id])
REFERENCES [Vnta].[tbVendedores] ([Vend_Id])
GO
ALTER TABLE [Logi].[tbBodegas] CHECK CONSTRAINT [FK_Logi_tbBodegas_Vnta_tbVendedores_Vend_Id]
GO
ALTER TABLE [Logi].[tbRecargas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRecargas_Acce_tbUsuarios_Usua_Confirmacion] FOREIGN KEY([Usua_Confirmacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbRecargas] CHECK CONSTRAINT [FK_Logi_tbRecargas_Acce_tbUsuarios_Usua_Confirmacion]
GO
ALTER TABLE [Logi].[tbRecargas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRecargas_Logi_tbBodegas_Bode_Id] FOREIGN KEY([Bode_Id])
REFERENCES [Logi].[tbBodegas] ([Bode_Id])
GO
ALTER TABLE [Logi].[tbRecargas] CHECK CONSTRAINT [FK_Logi_tbRecargas_Logi_tbBodegas_Bode_Id]
GO
ALTER TABLE [Logi].[tbRecargas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRecargas_Logi_tbTraslados_Tras_Id] FOREIGN KEY([Tras_Id])
REFERENCES [Logi].[tbTraslados] ([Tras_Id])
GO
ALTER TABLE [Logi].[tbRecargas] CHECK CONSTRAINT [FK_Logi_tbRecargas_Logi_tbTraslados_Tras_Id]
GO
ALTER TABLE [Logi].[tbRecargas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRecargas_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbRecargas] CHECK CONSTRAINT [FK_Logi_tbRecargas_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbRecargas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRecargas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbRecargas] CHECK CONSTRAINT [FK_Logi_tbRecargas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbRecargas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRecargas_Vnta_tbVendedores_Vend_Id] FOREIGN KEY([Vend_Id])
REFERENCES [Vnta].[tbVendedores] ([Vend_Id])
GO
ALTER TABLE [Logi].[tbRecargas] CHECK CONSTRAINT [FK_Logi_tbRecargas_Vnta_tbVendedores_Vend_Id]
GO
ALTER TABLE [Logi].[tbRecargasDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRecargasDetalle_Inve_tbProductos_Prod_Id] FOREIGN KEY([Prod_Id])
REFERENCES [Inve].[tbProductos] ([Prod_Id])
GO
ALTER TABLE [Logi].[tbRecargasDetalle] CHECK CONSTRAINT [FK_Logi_tbRecargasDetalle_Inve_tbProductos_Prod_Id]
GO
ALTER TABLE [Logi].[tbRecargasDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRecargasDetalle_Logi_tbRecargas_Reca_Id] FOREIGN KEY([Reca_Id])
REFERENCES [Logi].[tbRecargas] ([Reca_Id])
GO
ALTER TABLE [Logi].[tbRecargasDetalle] CHECK CONSTRAINT [FK_Logi_tbRecargasDetalle_Logi_tbRecargas_Reca_Id]
GO
ALTER TABLE [Logi].[tbRecargasDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRecargasDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbRecargasDetalle] CHECK CONSTRAINT [FK_Logi_tbRecargasDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbRecargasDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRecargasDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbRecargasDetalle] CHECK CONSTRAINT [FK_Logi_tbRecargasDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbRutas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRutas_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbRutas] CHECK CONSTRAINT [FK_Logi_tbRutas_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbRutas]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbRutas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbRutas] CHECK CONSTRAINT [FK_Logi_tbRutas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbTraslados]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbTraslados_Gral_tbSucursales_Sucu_Id] FOREIGN KEY([Tras_Origen])
REFERENCES [Gral].[tbSucursales] ([Sucu_Id])
GO
ALTER TABLE [Logi].[tbTraslados] CHECK CONSTRAINT [FK_Logi_tbTraslados_Gral_tbSucursales_Sucu_Id]
GO
ALTER TABLE [Logi].[tbTraslados]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbTraslados_Logi_tbBodegas_Tras_Destino] FOREIGN KEY([Tras_Destino])
REFERENCES [Logi].[tbBodegas] ([Bode_Id])
GO
ALTER TABLE [Logi].[tbTraslados] CHECK CONSTRAINT [FK_Logi_tbTraslados_Logi_tbBodegas_Tras_Destino]
GO
ALTER TABLE [Logi].[tbTraslados]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbTraslados_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbTraslados] CHECK CONSTRAINT [FK_Logi_tbTraslados_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbTraslados]  WITH CHECK ADD  CONSTRAINT [FK_Logi_tbTraslados_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbTraslados] CHECK CONSTRAINT [FK_Logi_tbTraslados_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbTrasladosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Logi_TrasladosDetalle_Inve_tbProductos_Prod_Id] FOREIGN KEY([Prod_Id])
REFERENCES [Inve].[tbProductos] ([Prod_Id])
GO
ALTER TABLE [Logi].[tbTrasladosDetalle] CHECK CONSTRAINT [FK_Logi_TrasladosDetalle_Inve_tbProductos_Prod_Id]
GO
ALTER TABLE [Logi].[tbTrasladosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Logi_TrasladosDetalle_Logi_tbTraslados_Tras_Id] FOREIGN KEY([Tras_Id])
REFERENCES [Logi].[tbTraslados] ([Tras_Id])
GO
ALTER TABLE [Logi].[tbTrasladosDetalle] CHECK CONSTRAINT [FK_Logi_TrasladosDetalle_Logi_tbTraslados_Tras_Id]
GO
ALTER TABLE [Logi].[tbTrasladosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Logi_TrasladosDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbTrasladosDetalle] CHECK CONSTRAINT [FK_Logi_TrasladosDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Logi].[tbTrasladosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Logi_TrasladosDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Logi].[tbTrasladosDetalle] CHECK CONSTRAINT [FK_Logi_TrasladosDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbCAIs]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbCAIs_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbCAIs] CHECK CONSTRAINT [FK_Vnta_tbCAIs_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbCAIs]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbCAIs_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbCAIs] CHECK CONSTRAINT [FK_Vnta_tbCAIs_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbConfiguracionFacturas]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbConfiguracionFacturas_Gral_tbColonias_Colo_Id] FOREIGN KEY([Colo_Id])
REFERENCES [Gral].[tbColonias] ([Colo_Id])
GO
ALTER TABLE [Vnta].[tbConfiguracionFacturas] CHECK CONSTRAINT [FK_Vnta_tbConfiguracionFacturas_Gral_tbColonias_Colo_Id]
GO
ALTER TABLE [Vnta].[tbConfiguracionFacturas]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbConfiguracionFacturas_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbConfiguracionFacturas] CHECK CONSTRAINT [FK_Vnta_tbConfiguracionFacturas_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbConfiguracionFacturas]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbConfiguracionFacturas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbConfiguracionFacturas] CHECK CONSTRAINT [FK_Vnta_tbConfiguracionFacturas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbCuentasPorCobrar_Gral_tbClientes_Clie_Id] FOREIGN KEY([Clie_Id])
REFERENCES [Gral].[tbClientes] ([Clie_Id])
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar] CHECK CONSTRAINT [FK_Vnta_tbCuentasPorCobrar_Gral_tbClientes_Clie_Id]
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbCuentasPorCobrar_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar] CHECK CONSTRAINT [FK_Vnta_tbCuentasPorCobrar_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbCuentasPorCobrar_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar] CHECK CONSTRAINT [FK_Vnta_tbCuentasPorCobrar_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbCuentasPorCobrar_Vnta_tbFacturas_Fact_Id] FOREIGN KEY([Fact_Id])
REFERENCES [Vnta].[tbFacturas] ([Fact_Id])
GO
ALTER TABLE [Vnta].[tbCuentasPorCobrar] CHECK CONSTRAINT [FK_Vnta_tbCuentasPorCobrar_Vnta_tbFacturas_Fact_Id]
GO
ALTER TABLE [Vnta].[tbDevoluciones]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbDevoluciones_Gral_tbClientes_Clie_Id] FOREIGN KEY([Clie_Id])
REFERENCES [Vnta].[tbFacturas] ([Fact_Id])
GO
ALTER TABLE [Vnta].[tbDevoluciones] CHECK CONSTRAINT [FK_Vnta_tbDevoluciones_Gral_tbClientes_Clie_Id]
GO
ALTER TABLE [Vnta].[tbDevoluciones]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbDevoluciones_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbDevoluciones] CHECK CONSTRAINT [FK_Vnta_tbDevoluciones_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbDevoluciones]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbDevoluciones_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbDevoluciones] CHECK CONSTRAINT [FK_Vnta_tbDevoluciones_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbDevoluciones]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbDevoluciones_Vnta_tbFacturas_Fact_Id] FOREIGN KEY([Fact_Id])
REFERENCES [Vnta].[tbFacturas] ([Fact_Id])
GO
ALTER TABLE [Vnta].[tbDevoluciones] CHECK CONSTRAINT [FK_Vnta_tbDevoluciones_Vnta_tbFacturas_Fact_Id]
GO
ALTER TABLE [Vnta].[tbDevolucionesDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbDevolucionesDetalle_Inve_tbProductos_Prod_Id] FOREIGN KEY([Prod_Id])
REFERENCES [Inve].[tbProductos] ([Prod_Id])
GO
ALTER TABLE [Vnta].[tbDevolucionesDetalle] CHECK CONSTRAINT [FK_Vnta_tbDevolucionesDetalle_Inve_tbProductos_Prod_Id]
GO
ALTER TABLE [Vnta].[tbDevolucionesDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbDevolucionesDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbDevolucionesDetalle] CHECK CONSTRAINT [FK_Vnta_tbDevolucionesDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbDevolucionesDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbDevolucionesDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbDevolucionesDetalle] CHECK CONSTRAINT [FK_Vnta_tbDevolucionesDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbDevolucionesDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbDevolucionesDetalle_Vnta_tbDevoluciones_Devo_Id] FOREIGN KEY([Devo_Id])
REFERENCES [Vnta].[tbDevoluciones] ([Devo_Id])
GO
ALTER TABLE [Vnta].[tbDevolucionesDetalle] CHECK CONSTRAINT [FK_Vnta_tbDevolucionesDetalle_Vnta_tbDevoluciones_Devo_Id]
GO
ALTER TABLE [Vnta].[tbFacturas]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbFacturas_Gral_tbClientes_Clie_Id] FOREIGN KEY([Clie_Id])
REFERENCES [Gral].[tbClientes] ([Clie_Id])
GO
ALTER TABLE [Vnta].[tbFacturas] CHECK CONSTRAINT [FK_Vnta_tbFacturas_Gral_tbClientes_Clie_Id]
GO
ALTER TABLE [Vnta].[tbFacturas]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbFacturas_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbFacturas] CHECK CONSTRAINT [FK_Vnta_tbFacturas_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbFacturas]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbFacturas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbFacturas] CHECK CONSTRAINT [FK_Vnta_tbFacturas_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbFacturas]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbFacturas_Vnta_tbRegistrosCAI_RegC_Id] FOREIGN KEY([RegC_Id])
REFERENCES [Vnta].[tbRegistrosCAI] ([RegC_Id])
GO
ALTER TABLE [Vnta].[tbFacturas] CHECK CONSTRAINT [FK_Vnta_tbFacturas_Vnta_tbRegistrosCAI_RegC_Id]
GO
ALTER TABLE [Vnta].[tbFacturas]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbFacturas_Vnta_tbVendedores_Vend_Id] FOREIGN KEY([Vend_Id])
REFERENCES [Vnta].[tbVendedores] ([Vend_Id])
GO
ALTER TABLE [Vnta].[tbFacturas] CHECK CONSTRAINT [FK_Vnta_tbFacturas_Vnta_tbVendedores_Vend_Id]
GO
ALTER TABLE [Vnta].[tbFacturasDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbFacturasDetalle_Inve_tbProductos_Prod_Id] FOREIGN KEY([Prod_Id])
REFERENCES [Inve].[tbProductos] ([Prod_Id])
GO
ALTER TABLE [Vnta].[tbFacturasDetalle] CHECK CONSTRAINT [FK_Vnta_tbFacturasDetalle_Inve_tbProductos_Prod_Id]
GO
ALTER TABLE [Vnta].[tbFacturasDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbFacturasDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbFacturasDetalle] CHECK CONSTRAINT [FK_Vnta_tbFacturasDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbFacturasDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbFacturasDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbFacturasDetalle] CHECK CONSTRAINT [FK_Vnta_tbFacturasDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbFacturasDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbFacturasDetalle_Vnta_tbFacturas_Fact_Id] FOREIGN KEY([Fact_Id])
REFERENCES [Vnta].[tbFacturas] ([Fact_Id])
GO
ALTER TABLE [Vnta].[tbFacturasDetalle] CHECK CONSTRAINT [FK_Vnta_tbFacturasDetalle_Vnta_tbFacturas_Fact_Id]
GO
ALTER TABLE [Vnta].[tbImpuestos]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbImpuestos_Usua_Creacion_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbImpuestos] CHECK CONSTRAINT [FK_Vnta_tbImpuestos_Usua_Creacion_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbImpuestos]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbImpuestos_Usua_Modificacion_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbImpuestos] CHECK CONSTRAINT [FK_Vnta_tbImpuestos_Usua_Modificacion_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbPedidos]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPedidos_Gral_tbDireccionesPorCliente_Clie_Id] FOREIGN KEY([DiCl_Id])
REFERENCES [Gral].[tbDireccionesPorCliente] ([DiCl_Id])
GO
ALTER TABLE [Vnta].[tbPedidos] CHECK CONSTRAINT [FK_Vnta_tbPedidos_Gral_tbDireccionesPorCliente_Clie_Id]
GO
ALTER TABLE [Vnta].[tbPedidos]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPedidos_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbPedidos] CHECK CONSTRAINT [FK_Vnta_tbPedidos_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbPedidos]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPedidos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbPedidos] CHECK CONSTRAINT [FK_Vnta_tbPedidos_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbPedidos]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPedidos_Vnta_tbVendedores_Vend_Id] FOREIGN KEY([Vend_Id])
REFERENCES [Vnta].[tbVendedores] ([Vend_Id])
GO
ALTER TABLE [Vnta].[tbPedidos] CHECK CONSTRAINT [FK_Vnta_tbPedidos_Vnta_tbVendedores_Vend_Id]
GO
ALTER TABLE [Vnta].[tbPedidosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPedidosDetalle_Inve_tbProductos_Prod_Id] FOREIGN KEY([Prod_Id])
REFERENCES [Inve].[tbProductos] ([Prod_Id])
GO
ALTER TABLE [Vnta].[tbPedidosDetalle] CHECK CONSTRAINT [FK_Vnta_tbPedidosDetalle_Inve_tbProductos_Prod_Id]
GO
ALTER TABLE [Vnta].[tbPedidosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPedidosDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbPedidosDetalle] CHECK CONSTRAINT [FK_Vnta_tbPedidosDetalle_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbPedidosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPedidosDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbPedidosDetalle] CHECK CONSTRAINT [FK_Vnta_tbPedidosDetalle_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbPedidosDetalle]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPedidosDetalle_Vnta_tbPedidos_Pedi_Id] FOREIGN KEY([Pedi_Id])
REFERENCES [Vnta].[tbPedidos] ([Pedi_Id])
GO
ALTER TABLE [Vnta].[tbPedidosDetalle] CHECK CONSTRAINT [FK_Vnta_tbPedidosDetalle_Vnta_tbPedidos_Pedi_Id]
GO
ALTER TABLE [Vnta].[tbPreciosPorProducto]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPreciosPorProducto_Gral_tbClientes_Clie_Id] FOREIGN KEY([Clie_Id])
REFERENCES [Gral].[tbClientes] ([Clie_Id])
GO
ALTER TABLE [Vnta].[tbPreciosPorProducto] CHECK CONSTRAINT [FK_Vnta_tbPreciosPorProducto_Gral_tbClientes_Clie_Id]
GO
ALTER TABLE [Vnta].[tbPreciosPorProducto]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPreciosPorProducto_Inve_tbProductos_Prod_Id] FOREIGN KEY([Prod_Id])
REFERENCES [Inve].[tbProductos] ([Prod_Id])
GO
ALTER TABLE [Vnta].[tbPreciosPorProducto] CHECK CONSTRAINT [FK_Vnta_tbPreciosPorProducto_Inve_tbProductos_Prod_Id]
GO
ALTER TABLE [Vnta].[tbPreciosPorProducto]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPreciosPorProducto_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbPreciosPorProducto] CHECK CONSTRAINT [FK_Vnta_tbPreciosPorProducto_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbPreciosPorProducto]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPreciosPorProducto_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbPreciosPorProducto] CHECK CONSTRAINT [FK_Vnta_tbPreciosPorProducto_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbPuntosEmision]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPuntosEmision_Gral_tbSucursales_Sucu_Id] FOREIGN KEY([Sucu_Id])
REFERENCES [Gral].[tbSucursales] ([Sucu_Id])
GO
ALTER TABLE [Vnta].[tbPuntosEmision] CHECK CONSTRAINT [FK_Vnta_tbPuntosEmision_Gral_tbSucursales_Sucu_Id]
GO
ALTER TABLE [Vnta].[tbPuntosEmision]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPuntosEmision_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbPuntosEmision] CHECK CONSTRAINT [FK_Vnta_tbPuntosEmision_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbPuntosEmision]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbPuntosEmision_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbPuntosEmision] CHECK CONSTRAINT [FK_Vnta_tbPuntosEmision_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbRegistrosCAI]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbRegistrosCAI_Gral_tbCAIs_NCai_Id] FOREIGN KEY([NCai_Id])
REFERENCES [Vnta].[tbCAIs] ([NCai_Id])
GO
ALTER TABLE [Vnta].[tbRegistrosCAI] CHECK CONSTRAINT [FK_Vnta_tbRegistrosCAI_Gral_tbCAIs_NCai_Id]
GO
ALTER TABLE [Vnta].[tbRegistrosCAI]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbRegistrosCAI_Gral_tbPuntosEmision_PuEm_Id] FOREIGN KEY([PuEm_Id])
REFERENCES [Vnta].[tbPuntosEmision] ([PuEm_Id])
GO
ALTER TABLE [Vnta].[tbRegistrosCAI] CHECK CONSTRAINT [FK_Vnta_tbRegistrosCAI_Gral_tbPuntosEmision_PuEm_Id]
GO
ALTER TABLE [Vnta].[tbRegistrosCAI]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbRegistrosCAI_Gral_tbSucursales_Sucu_Id] FOREIGN KEY([Sucu_Id])
REFERENCES [Gral].[tbSucursales] ([Sucu_Id])
GO
ALTER TABLE [Vnta].[tbRegistrosCAI] CHECK CONSTRAINT [FK_Vnta_tbRegistrosCAI_Gral_tbSucursales_Sucu_Id]
GO
ALTER TABLE [Vnta].[tbRegistrosCAI]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbRegistrosCAI_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbRegistrosCAI] CHECK CONSTRAINT [FK_Vnta_tbRegistrosCAI_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbRegistrosCAI]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbRegistrosCAI_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbRegistrosCAI] CHECK CONSTRAINT [FK_Vnta_tbRegistrosCAI_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbVendedores]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbVendedores_Acce_tbUsuarios_Usua_Creacion_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbVendedores] CHECK CONSTRAINT [FK_Vnta_tbVendedores_Acce_tbUsuarios_Usua_Creacion_Usua_Id]
GO
ALTER TABLE [Vnta].[tbVendedores]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbVendedores_Acce_tbUsuarios_Usua_Modificacion_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbVendedores] CHECK CONSTRAINT [FK_Vnta_tbVendedores_Acce_tbUsuarios_Usua_Modificacion_Usua_Id]
GO
ALTER TABLE [Vnta].[tbVendedores]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbVendedores_Gral_tbColonias_Colo_Id] FOREIGN KEY([Colo_Id])
REFERENCES [Gral].[tbColonias] ([Colo_Id])
GO
ALTER TABLE [Vnta].[tbVendedores] CHECK CONSTRAINT [FK_Vnta_tbVendedores_Gral_tbColonias_Colo_Id]
GO
ALTER TABLE [Vnta].[tbVendedores]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbVendedores_Gral_tbEmpleados_Vend_Ayudante_Empl_Id] FOREIGN KEY([Vend_Ayudante])
REFERENCES [Gral].[tbEmpleados] ([Empl_Id])
GO
ALTER TABLE [Vnta].[tbVendedores] CHECK CONSTRAINT [FK_Vnta_tbVendedores_Gral_tbEmpleados_Vend_Ayudante_Empl_Id]
GO
ALTER TABLE [Vnta].[tbVendedores]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbVendedores_Gral_tbEmpleados_Vend_Supervisor_Empl_Id] FOREIGN KEY([Vend_Supervisor])
REFERENCES [Gral].[tbEmpleados] ([Empl_Id])
GO
ALTER TABLE [Vnta].[tbVendedores] CHECK CONSTRAINT [FK_Vnta_tbVendedores_Gral_tbEmpleados_Vend_Supervisor_Empl_Id]
GO
ALTER TABLE [Vnta].[tbVendedores]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbVendedores_Gral_tbSucursales_Sucu_Id] FOREIGN KEY([Sucu_Id])
REFERENCES [Gral].[tbSucursales] ([Sucu_Id])
GO
ALTER TABLE [Vnta].[tbVendedores] CHECK CONSTRAINT [FK_Vnta_tbVendedores_Gral_tbSucursales_Sucu_Id]
GO
ALTER TABLE [Vnta].[tbVendedoresPorRuta]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbVendedoresPorRuta_Logi_tbRutas_Ruta_Id] FOREIGN KEY([Ruta_Id])
REFERENCES [Logi].[tbRutas] ([Ruta_Id])
GO
ALTER TABLE [Vnta].[tbVendedoresPorRuta] CHECK CONSTRAINT [FK_Vnta_tbVendedoresPorRuta_Logi_tbRutas_Ruta_Id]
GO
ALTER TABLE [Vnta].[tbVendedoresPorRuta]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbVendedoresPorRuta_Usua_Creacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Creacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbVendedoresPorRuta] CHECK CONSTRAINT [FK_Vnta_tbVendedoresPorRuta_Usua_Creacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbVendedoresPorRuta]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbVendedoresPorRuta_Usua_Modificacion_Acce_tbUsuarios_Usua_Id] FOREIGN KEY([Usua_Modificacion])
REFERENCES [Acce].[tbUsuarios] ([Usua_Id])
GO
ALTER TABLE [Vnta].[tbVendedoresPorRuta] CHECK CONSTRAINT [FK_Vnta_tbVendedoresPorRuta_Usua_Modificacion_Acce_tbUsuarios_Usua_Id]
GO
ALTER TABLE [Vnta].[tbVendedoresPorRuta]  WITH CHECK ADD  CONSTRAINT [FK_Vnta_tbVendedoresPorRuta_Vnta_tbVendedores_Vend_Id] FOREIGN KEY([Vend_Id])
REFERENCES [Vnta].[tbVendedores] ([Vend_Id])
GO
ALTER TABLE [Vnta].[tbVendedoresPorRuta] CHECK CONSTRAINT [FK_Vnta_tbVendedoresPorRuta_Vnta_tbVendedores_Vend_Id]
GO
ALTER TABLE [Gral].[tbAvales]  WITH CHECK ADD  CONSTRAINT [CK_Gral_tbAvales_Aval_Sexo] CHECK  (([Aval_Sexo]='M' OR [Aval_Sexo]='F'))
GO
ALTER TABLE [Gral].[tbAvales] CHECK CONSTRAINT [CK_Gral_tbAvales_Aval_Sexo]
GO
ALTER TABLE [Gral].[tbClientes]  WITH CHECK ADD  CONSTRAINT [CK_Gral_tbClientes_Clie_Sexo] CHECK  (([Clie_Sexo]='M' OR [Clie_Sexo]='F'))
GO
ALTER TABLE [Gral].[tbClientes] CHECK CONSTRAINT [CK_Gral_tbClientes_Clie_Sexo]
GO
ALTER TABLE [Gral].[tbEmpleados]  WITH CHECK ADD  CONSTRAINT [CK_Gral_tbEmpleados_Empl_Sexo] CHECK  (([Empl_Sexo]='M' OR [Empl_Sexo]='F'))
GO
ALTER TABLE [Gral].[tbEmpleados] CHECK CONSTRAINT [CK_Gral_tbEmpleados_Empl_Sexo]
GO
ALTER TABLE [Logi].[tbBodegas]  WITH CHECK ADD  CONSTRAINT [CK_Logi_tbBodegas_Bode_TipoCamion] CHECK  (([Bode_TipoCamion]='M' OR [Bode_TipoCamion]='G' OR [Bode_TipoCamion]='P'))
GO
ALTER TABLE [Logi].[tbBodegas] CHECK CONSTRAINT [CK_Logi_tbBodegas_Bode_TipoCamion]
GO
ALTER TABLE [Logi].[tbRecargas]  WITH CHECK ADD  CONSTRAINT [CK_Logi_tbRecargas_Reca_Confirmacion] CHECK  (([Reca_Confirmacion]='R' OR [Reca_Confirmacion]='A' OR [Reca_Confirmacion]='P'))
GO
ALTER TABLE [Logi].[tbRecargas] CHECK CONSTRAINT [CK_Logi_tbRecargas_Reca_Confirmacion]
GO
ALTER TABLE [Vnta].[tbVendedores]  WITH CHECK ADD  CONSTRAINT [CK_Vnta_tbVendedores_Vend_Sexo] CHECK  (([Vend_Sexo]='M' OR [Vend_Sexo]='F'))
GO
ALTER TABLE [Vnta].[tbVendedores] CHECK CONSTRAINT [CK_Vnta_tbVendedores_Vend_Sexo]
GO
ALTER TABLE [Vnta].[tbVendedores]  WITH CHECK ADD  CONSTRAINT [CK_Vnta_tbVendedores_Vend_Tipo] CHECK  (([Vend_Tipo]='F' OR [Vend_Tipo]='V' OR [Vend_Tipo]='P'))
GO
ALTER TABLE [Vnta].[tbVendedores] CHECK CONSTRAINT [CK_Vnta_tbVendedores_Vend_Tipo]
GO
