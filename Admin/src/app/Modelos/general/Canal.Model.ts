export class Canal {
  cana_Id: number = 0;
  cana_Descripcion: string = '';
  cana_Observaciones: string = '';
  usua_Creacion: number = 0;
  cana_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  cana_FechaModificacion?: Date;
  cana_Estado: boolean = true;
  usuaC_Nombre: string = '';
  usuaM_Nombre: string = '';

  constructor(init?: Partial<Canal>) {
    Object.assign(this, init);
  }
}