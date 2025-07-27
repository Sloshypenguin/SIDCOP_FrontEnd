export class Aval{
    aval_Id: number = 0;
    clie_Id: number = 0;
    aval_Nombres: string = '';
    aval_Apellidos: string = '';
    aval_Sexo: string = '';
    pare_Id: number = 0;
    aval_DNI: string = '';
    aval_Telefono: string = '';
    tiVi_Id: number = 0;
    aval_Observaciones: string = '';
    aval_DireccionExacta: string = '';
    colo_Id: number = 0;
    aval_FechaNacimiento: Date = new Date();
    esCv_Id: number = 0;
    usua_Creacion: number = 0;
    usuarioCreacion: string = '';
    aval_FechaCreacion: Date = new Date();
    usua_Modificacion: number = 0;
    usuarioModificacion: string = '';
    aval_FechaModificacion: Date = new Date();

    constructor(init?:Partial<Aval>) {
        Object.assign(this, init);
    }
}