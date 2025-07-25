

export class DescuentoDetalle{
  desD_Id: number = 0;
  desc_Id: number = 0;
  desD_IdReferencia: number = 0;
  idReferencias: number[] = [] ; 
  usua_Creacion: number = 0;
  desD_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  desD_FechaModificacion?: Date;
  desD_Estado: boolean = false;
  
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<DescuentoDetalle>) {
    Object.assign(this, init);
  }
}