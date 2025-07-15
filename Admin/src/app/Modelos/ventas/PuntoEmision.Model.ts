export class PuntoEmision {
  puEm_Id: number = 0;
  puEm_Codigo: string = '';
  puEm_Descripcion: string = '';

  usuarioCreacion: string = '';
  usuarioModificacion: string = '';

  usua_Creacion: number = 0;
  puEm_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  puEm_FechaModificacion?: Date;
  regC_Estado: boolean = true;

  constructor(init?: Partial<PuntoEmision>) {
    Object.assign(this, init);
  }
}
