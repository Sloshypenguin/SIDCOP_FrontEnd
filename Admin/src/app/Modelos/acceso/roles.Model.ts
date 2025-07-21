export class Rol {
    secuencia?: number = 0;
    role_Id: number = 0;
    role_Descripcion: string = '';
    role_Estado: boolean = false;
    usua_Creacion: number = 0;
    role_FechaCreacion: Date = new Date();
    usua_Modificacion?: number;
    role_FechaModificacion?: Date;
    usuarioCreacion: string = '';
    usuarioModificacion?: string;

    code_Status: number = 0;
    message_Status: string = '';

    constructor(init?: Partial<Rol>) {
        Object.assign(this, init);
    }
}