export class Producto {
    prod_Id: number = 0;
    prod_Descripcion: string = '';
    prod_DescripcionCorta: string = '';
    prod_Imagen?: string = '';
    prod_Codigo: string = '';
    prod_CodigoBarra: string = '';
    cate_Id?: number = 0;
    cate_Descripcion?: string = '';
    subc_Id: number = 0;
    marc_Id: number = 0;
    prov_Id: number = 0;
    impu_Id?: number = 0;
    prod_PrecioUnitario: number = 0;
    prod_CostoTotal: number = 0;
    prod_PagaImpuesto: boolean = false;
    prod_PromODesc: number = 0;
    prod_EsPromo: boolean = false;
    prod_Estado: boolean = true;
    usua_Creacion: number = 0;
    prod_FechaCreacion: Date = new Date();
    usua_Modificacion?: number;
    prod_FechaModificacion?: Date;
    marc_Descripcion?: string = '';
    prov_NombreEmpresa?: string = '';
    subc_Descripcion?: string = '';
    impu_Descripcion?: string = '';
    usuarioCreacion?: string = '';
    usuarioModificacion?: string;
    secuencia?: number;
    code_Status: number = 0;
    message_Status: string = '';

    constructor(init?: Partial<Producto>) {
    Object.assign(this, init);
  }
}