export class Cargos{
  Carg_Id: number = 0;
  Carg_Descripcion: string = '';
  Usua_Creacion: number = 0;
  Carg_FechaCreacion: Date = new Date();
  Usua_Modificacion?: number;
  Carg_FechaModificacion?: Date;
  Carg_Estado: string = '';
  UsuaC_Nombre: string = '';
  UsuaM_Nombre: string = '';
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<Cargos>) {
    Object.assign(this, init);
  }
}
