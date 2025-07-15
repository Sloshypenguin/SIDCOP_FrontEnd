export class Sucursales {
  sucu_Id: number = 0;
  sucu_Descripcion: string = '';
  colo_Id: number = 0;
  sucu_DireccionExacta: string = '';
  sucu_Telefono1: string = '';
  sucu_Telefono2: string = '';
  sucu_Correo: string = '';
  usua_Creacion: number = 0;
  sucu_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  sucu_FechaModificacion?: Date;
  sucu_Estado: boolean = true;

  constructor(init?: Partial<Sucursales>) {
    Object.assign(this, init);
  }
}