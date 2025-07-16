export class Impuestos {
  impu_Id: number = 0;
  impu_Descripcion: string = '';
  impu_Valor: number = 0;
  usua_Creacion: number = 0;
  impu_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  impu_FechaModificacion?: Date;
  impu_Estado: boolean = true;
    code_Status: number = 0;
  message_Status: string ='';
  secuencia?: number;
  constructor(init?: Partial<Impuestos>) {
    Object.assign(this, init);
  }
}
