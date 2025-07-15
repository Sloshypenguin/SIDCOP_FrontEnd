export class MarcasVehiculos{

    maVe_Id: number = 0;
    maVe_Marca: string = "";
    usua_Creacion: number = 0;
    maVe_FechaCreacion: Date = new Date();
    usua_Modificacion: number = 0;
    maVe_FechaModificacion: Date = new Date();
    maVe_Estado: boolean = true;
    usuarioCreacion: string = "";
    usuarioModificacion: string = "";
    code_Status: number = 0;
    message_Status: string = "";

    constructor(init?: Partial<MarcasVehiculos>) {
        Object.assign(this, init);
    }

}