export class EstadoCivil{
  esCv_Id: number = 0;
  esCv_Descripcion: string = '';
  usua_Creacion: number = 0;
  usua_Modificacion: number = 0;
  numero: String = '';
  esCv_FechaCreacion: Date = new Date();
  esCv_FechaModificacion: Date = new Date();
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<EstadoCivil>) {
    Object.assign(this, init);
  }
}
