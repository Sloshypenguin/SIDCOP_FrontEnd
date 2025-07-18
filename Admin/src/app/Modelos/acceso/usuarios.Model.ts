export class Usuario{
    secuencia: number = 0;
    usua_Id: number = 0;
    usua_Usuario: string = '';
    usua_Clave: string = '';
    role_Id: number = 0;
    usua_IdPersona: number = 0;
    usua_EsVendedor: boolean = false;
    usua_EsAdmin: boolean = false;
    usua_Imagen: string = '';
    usua_Creacion: number = 0;
    usua_FechaCreacion: Date = new Date();
    usua_Modificacion?: number;
    usua_FechaModificacion?: Date;
    usua_Estado: boolean = false;
    
    permisosJson: string = '';
    role_Descripcion: string = '';
    nombreCompleto: string = '';

    code_Status: number = 0;
    message_Status: string ='';

    constructor(init?: Partial<Usuario>) {
        Object.assign(this, init);
    }
}