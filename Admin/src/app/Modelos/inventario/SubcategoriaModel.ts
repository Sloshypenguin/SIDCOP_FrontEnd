export class Subcategoria{
  subc_Id: number = 0;
  subc_Descripcion: string = '';
  cate_Id: number = 0;
  usua_Creacion: number = 0;
  subc_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  subc_FechaModificacion: Date = new Date();
  subc_Estado: boolean = false;
  
  cate_Descripcion: string = '';
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  code_Status: number = 0;
  message_Status: string ='';  
  No?: number = 0;
    

  constructor(init?: Partial<Subcategoria>) {
    Object.assign(this, init);
  }
}


    