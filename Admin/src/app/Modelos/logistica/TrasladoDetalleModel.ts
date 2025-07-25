export class TrasladoDetalle {
  trDe_Id: number = 0;
  tras_Id: number = 0;
  prod_Id: number = 0;
  trDe_Cantidad: number = 0;
  trDe_Observaciones: string = '';
  usua_Creacion: number = 0;
  trDe_FechaCreacion: Date = new Date();
  usua_Modificacion?: number = 0;
  trDe_FechaModificacion?: Date = new Date();

  constructor(init?: Partial<TrasladoDetalle>) {
    Object.assign(this, init);
  }
}