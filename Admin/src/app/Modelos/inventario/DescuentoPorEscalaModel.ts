

export class DescuentoPorEscala{
  deEs_Id: number = 0;
  desc_Id: number = 0;
  deEs_InicioEscala: number = 0;
  deEs_FinEscala: number = 0;
  deEs_Valor: number = 0;
  usua_Creacion: number = 0;
  deEs_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  deEs_FechaModificacion?: Date;
  deEs_Estado: boolean = false;
  escalas_JSON: string = '';
  escalas: EscalaDetalleViewModel[] = [];
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<DescuentoPorEscala>) {
    Object.assign(this, init);
  }
}

export class EscalaDetalleViewModel {
  deEs_InicioEscala: number = 0;
  deEs_FinEscala: number = 0;
  deEs_Valor: number = 0;
}