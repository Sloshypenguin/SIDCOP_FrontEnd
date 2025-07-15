export class ConfiguracionFactura {
  coFa_Id: number = 0;
  coFa_NombreEmpresa: string = '';
  coFa_DireccionEmpresa: string = '';
  coFa_RTN: string = '';
  coFa_Correo: string = '';
  coFa_Telefono1: string = '';
  coFa_Telefono2: string = '';
  coFa_Logo: string = '';
  colo_Id: number = 0;
  usua_Creacion: number = 0;
  coFa_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  coFa_FechaModificacion?: Date;
  coFa_Estado: boolean = true;

  constructor(init?: Partial<ConfiguracionFactura>) {
    Object.assign(this, init);
  }
}
