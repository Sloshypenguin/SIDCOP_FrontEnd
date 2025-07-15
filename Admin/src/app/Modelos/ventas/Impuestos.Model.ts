export class Impuestos {
  Impu_Id: number = 0;
  Impu_Descripcion: string = '';
  Impu_Valor: number = 0;
  Usua_Creacion: number = 0;
  Impu_FechaCreacion: Date = new Date();
  Usua_Modificacion?: number;
  Impu_FechaModificacion?: Date;
  Impu_Estado: boolean = true;

  constructor(init?: Partial<Impuestos>) {
    Object.assign(this, init);
  }
}
