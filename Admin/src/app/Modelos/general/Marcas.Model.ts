export class Marcas{
    marc_Id: number = 0;
    marc_Descripcion: string = " ";
    usua_Creacion: number = 0;
    marc_FechaCreacion: Date = new Date();
    usua_Modificacion: number = 0;
    marc_FechaModificacion: Date = new Date();
    marc_Estado: boolean = true;
    usuarioCreacion: string = "";
    usuarioModificacion: string = "";
    code_Status: number = 0;
    message_Status: string = "";
    secuencia: number = 0;

    constructor(init?: Partial<Marcas>) {
        Object.assign(this, init);
    }
}