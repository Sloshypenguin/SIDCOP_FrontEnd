export class Categoria{
  cate_Id: number = 0;
  cate_Descripcion: string = '';
  usua_Creacion: number = 0;
  cate_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  cate_FechaModificacion?: Date;
  cate_Estado: boolean = false;
  
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<Categoria>) {
    Object.assign(this, init);
  }
}


    