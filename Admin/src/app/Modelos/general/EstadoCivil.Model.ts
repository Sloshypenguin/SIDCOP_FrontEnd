export class EstadoCivil{
  esCv_Id: number = 0;
  esCv_Descripcion: string = '';
  usua_Creacion: number = 0;
  esCv_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  secuencia?: number;
  esCv_FechaModificacion?: Date;
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<EstadoCivil>) {
    Object.assign(this, init);
  }
}
