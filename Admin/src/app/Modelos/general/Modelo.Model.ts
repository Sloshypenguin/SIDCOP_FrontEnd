export class Modelo {
  mode_Id: number = 0;
  maVe_Id: number = 0;
  maVe_Marca: string = '';
  mode_Descripcion: string = '';
  usua_Creacion: number = 0;
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  mode_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  mode_FechaModificacion?: Date;
  mode_Estado: boolean = true; 
  code_Status: number = 0;
  message_Status: string = '';
  No?: number = 0;

  constructor(init?: Partial<Modelo>) {
    Object.assign(this, init);
  }
}