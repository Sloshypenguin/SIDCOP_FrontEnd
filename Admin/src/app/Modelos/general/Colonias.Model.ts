export class Colonias {
  colo_Id?: number = 0;
  colo_Descripcion?: string = '';
  muni_Codigo?: string = '';
  muni_Descripcion?: string;
  usua_Creacion?: number = 0;
  colo_FechaCreacion?: Date = new Date();
  usua_Modificacion?: number;
  secuencia?: number; 
  depa_Codigo?: string;
  depa_Descripcion?: string;
  colo_FechaModificacion?: Date;
  usuarioCreacion?: string = '';
  usuarioModificacion?: string = '';
  code_Status: number = 0;
  message_Status: string = '';

  constructor(init?: Partial<Colonias>) {
    Object.assign(this, init);
  }
}