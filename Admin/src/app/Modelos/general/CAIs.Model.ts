export class CAIs{
  nCai_Id: number = 0;
  nCai_Codigo: string = '';
  NCai_Descripcion: string = '';
  usua_Creacion: number = 0;
  NCai_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  NCai_FechaModificacion?: Date;
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<CAIs>) {
    Object.assign(this, init);
  }
}
