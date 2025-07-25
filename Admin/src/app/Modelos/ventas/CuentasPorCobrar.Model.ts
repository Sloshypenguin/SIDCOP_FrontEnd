export class CuentaPorCobrar {
  cpCo_Id: number = 0;
  clie_Id: number = 0;
  fact_Id: number = 0;
  cpCo_FechaEmision: Date = new Date();
  cpCo_FechaVencimiento: Date = new Date();
  cpCo_Valor: number = 0;
  cpCo_Saldo: number = 0;
  cpCo_Observaciones: string = '';
  cpCo_Anulado: boolean = false;
  cpCo_Saldada: boolean = false;
  usua_Creacion: number = 0;
  cpCo_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  cpCo_FechaModificacion?: Date;
  cpCo_Estado: boolean = true;
  secuencia?: number;
  
  // Propiedades adicionales (NotMapped en el backend)
  clie_Codigo: string = '';
  clie_Nombres: string = '';
  clie_Apellidos: string = '';
  clie_NombreNegocio: string = '';
  clie_Telefono: string = '';
  clie_LimiteCredito: number = 0;
  clie_Saldo: number = 0;
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  code_Status: number = 0;
  message_Status: string = '';

  constructor(init?: Partial<CuentaPorCobrar>) {
    Object.assign(this, init);
  }
}
