export class Cargos{
  carg_Id: number = 0;
  carg_Descripcion: string = '';
  usua_Creacion: number = 0;
  carg_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  carg_FechaModificacion?: Date;
  carg_Estado: string = '';
  usuaC_Nombre: string = '';
  usuaM_Nombre: string = '';
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<Cargos>) {
    Object.assign(this, init);
  }
}
