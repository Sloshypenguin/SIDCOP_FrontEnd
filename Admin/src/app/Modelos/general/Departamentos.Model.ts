export class Departamento{
  depa_Codigo: string = '';
  depa_Descripcion: string = '';
  usua_Creacion: number = 0;
  depa_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  secuencia?: number;
  depa_FechaModificacion?: Date;
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<Departamento>) {
    Object.assign(this, init);
  }
}