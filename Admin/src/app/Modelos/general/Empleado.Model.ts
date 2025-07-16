export class Empleado{
  empl_Id: number = 0;
  empl_DNI: string = '';
  empl_Codigo: string = '';
  empl_Nombres: string = '';
  empl_Apellidos: string = '';
  empl_Sexo: string = '';
  empl_FechaNacimiento:  Date = new Date();
  empl_Correo: string = '';
  empl_Telefono: string = '';
  sucu_Id: number = 0;
  esCv_Id: number = 0;
  carg_Id: number = 0;
  colo_Id: number = 0;
  empl_DireccionExacta: string = '';
  empl_Estado: boolean = true;
  usua_Creacion: number = 0;
  empl_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  empl_FechaModificacion?: Date;

  constructor(init?: Partial<Empleado>) {
    Object.assign(this, init);
  }
}



