export class Sucursales {
  Sucu_Id: number = 0;
  Sucu_Descripcion: string = '';
  Colo_Id: number = 0;
  Sucu_DireccionExacta: string = '';
  Sucu_Telefono1: string = '';
  Sucu_Telefono2: string = '';
  Sucu_Correo: string = '';
  Usua_Creacion: number = 0;
  Sucu_FechaCreacion: Date = new Date();
  Usua_Modificacion?: number;
  Sucu_FechaModificacion?: Date;
  Sucu_Estado: boolean = true;

  constructor(init?: Partial<Sucursales>) {
    Object.assign(this, init);
  }
}
