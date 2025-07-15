export class Bodega{
  bode_Id: number = 0;
  bode_Descripcion: string = '';
  sucu_Id: number = 0;
  regC_Id: number = 0;
  vend_Id: number = 0;
  mode_Id: number = 0;
  bode_VIN: string = '';
  bode_Placa: string = '';
  bode_Capacidad: number = 0;
  bode_TipoCamion: string = '';
  usua_Creacion: number = 0;
  bode_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  secuencia?: number;
  bode_FechaModificacion?: Date;
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';
  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<Bodega>) {
    Object.assign(this, init);
  }
}