export class Aval{
    aval_Id: number = 0;
    clie_id: number = 0;
    aval_Nombres: string = '';
    aval_Apellidos: string = '';
    aval_ParentescoConCliente: string = '';
    aval_DNI: string = '';
    aval_Telefono: string = '';
    tiVi_Id: number = 0;
    aval_DireccionExacta: string = '';
    colo_Id: number = 0;
    aval_FechaNacimiento: Date = new Date();
    esCv_Id: number = 0;
    aval_Sexo: string = '';
    usua_Creacion: number = 0;
    usuarioCreacion: string = '';
    aval_FechaCreacion: Date = new Date();
    usua_Modificacion?: number;
    usuarioModificacion?: string;
    aval_FechaModificacion?: Date;

    constructor(init?:Partial<Aval>) {
        Object.assign(this, init);
    }
}