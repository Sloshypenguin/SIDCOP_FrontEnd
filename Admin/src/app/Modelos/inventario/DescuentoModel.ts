export class Descuento{
  desc_Id: number = 0;
  desc_Descripcion: string = '';
  desc_Tipo: boolean = false; 
  desc_Aplicar: string = '';
  desc_FechaInicio: Date = new Date();
  desc_FechaFin: Date = new Date();
  desc_Observaciones: string = '';
  usua_Creacion: number = 0;
  desc_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  desc_FechaModificacion?: Date;
  desc_Estado: boolean = false;
  
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  code_Status: number = 0;
  message_Status: string ='';
  secuencia?: string ='';

  constructor(init?: Partial<Descuento>) {
    Object.assign(this, init);
  }
}