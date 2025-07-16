export class Proveedor{
  prov_Id: number = 0;
  prov_Codigo: string = '';
  prov_NombreEmpresa: string = '';
  prov_NombreContacto: string = '';
  colo_Id: number = 0;
  prov_DireccionExacta: string = '';
  prov_Telefono: string = '';
  prov_Correo: string = '';
  prov_Observaciones: string = '';
  colo_Descripcion: string = '';
  depa_Descripcion: string = '';
  muni_Descripcion: string = '';
depa_Codigo: string = '';
  muni_Codigo: string = '';
  

  usua_Creacion: number = 0;
  fechaCreacion: Date = new Date();
  usua_Modificacion?: number;


  fechaModificacion?: Date;
  usuarioCreacion: string = '';
  usuarioModificacion: string = '';

  code_Status: number = 0;
  message_Status: string ='';

  constructor(init?: Partial<Proveedor>) {
    Object.assign(this, init);
  }
}
