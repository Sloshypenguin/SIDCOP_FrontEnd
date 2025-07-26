

export class DescuentoPorCliente{
  deCl_Id: number = 0;
  desc_Id: number = 0;
  clie_Id: number = 0;
  idClientes: number[] = [] ; 
  usua_Creacion: number = 0;
  deEs_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  deEs_FechaModificacion?: Date;
  deCl_Estado: boolean = false;
  
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<DescuentoPorCliente>) {
    Object.assign(this, init);
  }
}