export class Parentesco {
  pare_Id: number = 0;
  pare_Descripcion: string = '';
  pare_Observaciones: string = '';
  usua_Creacion: number = 0;
  pare_FechaCreacion: Date = new Date();
  usua_Modificacion?: number;
  pare_FechaModificacion: Date = new Date();
  pare_Estado: boolean = true;
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';

  constructor(init?: Partial<Parentesco>) {
    Object.assign(this, init);
  }
}