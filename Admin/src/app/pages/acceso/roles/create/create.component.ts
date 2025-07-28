import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Rol } from 'src/app/Modelos/acceso/roles.Model';
import { environment } from 'src/environments/environment.prod';
import { getUserId } from 'src/app/core/utils/user-utils';
import { Usuario } from 'src/app/Modelos/acceso/usuarios.Model';

interface TreeItem {
  id: string;
  name: string;
  type: 'esquema' | 'pantalla' | 'accion';
  selected: boolean;
  expanded: boolean;
  children?: TreeItem[];
  parent?: TreeItem;
}

interface Esquema {
  Esquema: string;
  Pantallas: Pantalla[];
}

interface Pantalla {
  Pant_Id: number;
  Pant_Descripcion: string;
  Acciones: Accion[];
}

interface Accion {
  Acci_Id: number;
  Accion: string;
}

// Lista completa de acciones por pantalla
const accionesPorPantalla = [
  { AcPa_Id: 1, Pant_Id: 6, Acci_Id: 1 }, { AcPa_Id: 2, Pant_Id: 6, Acci_Id: 2 }, { AcPa_Id: 3, Pant_Id: 6, Acci_Id: 3 }, { AcPa_Id: 4, Pant_Id: 6, Acci_Id: 5 },
  { AcPa_Id: 5, Pant_Id: 7, Acci_Id: 1 }, { AcPa_Id: 6, Pant_Id: 7, Acci_Id: 2 }, { AcPa_Id: 7, Pant_Id: 7, Acci_Id: 5 }, { AcPa_Id: 8, Pant_Id: 7, Acci_Id: 6 },
  { AcPa_Id: 9, Pant_Id: 7, Acci_Id: 7 }, { AcPa_Id: 10, Pant_Id: 7, Acci_Id: 8 }, { AcPa_Id: 11, Pant_Id: 8, Acci_Id: 1 }, { AcPa_Id: 12, Pant_Id: 8, Acci_Id: 2 },
  { AcPa_Id: 13, Pant_Id: 8, Acci_Id: 3 }, { AcPa_Id: 14, Pant_Id: 8, Acci_Id: 5 }, { AcPa_Id: 15, Pant_Id: 9, Acci_Id: 1 }, { AcPa_Id: 16, Pant_Id: 9, Acci_Id: 2 },
  { AcPa_Id: 17, Pant_Id: 9, Acci_Id: 3 }, { AcPa_Id: 18, Pant_Id: 9, Acci_Id: 5 }, { AcPa_Id: 19, Pant_Id: 10, Acci_Id: 1 }, { AcPa_Id: 20, Pant_Id: 10, Acci_Id: 2 },
  { AcPa_Id: 21, Pant_Id: 10, Acci_Id: 5 }, { AcPa_Id: 22, Pant_Id: 10, Acci_Id: 6 }, { AcPa_Id: 23, Pant_Id: 11, Acci_Id: 1 }, { AcPa_Id: 24, Pant_Id: 11, Acci_Id: 2 },
  { AcPa_Id: 25, Pant_Id: 11, Acci_Id: 3 }, { AcPa_Id: 26, Pant_Id: 11, Acci_Id: 5 }, { AcPa_Id: 27, Pant_Id: 12, Acci_Id: 1 }, { AcPa_Id: 28, Pant_Id: 12, Acci_Id: 2 },
  { AcPa_Id: 29, Pant_Id: 12, Acci_Id: 3 }, { AcPa_Id: 30, Pant_Id: 12, Acci_Id: 5 }, { AcPa_Id: 31, Pant_Id: 13, Acci_Id: 1 }, { AcPa_Id: 32, Pant_Id: 13, Acci_Id: 2 },
  { AcPa_Id: 33, Pant_Id: 13, Acci_Id: 3 }, { AcPa_Id: 34, Pant_Id: 13, Acci_Id: 5 }, { AcPa_Id: 35, Pant_Id: 14, Acci_Id: 1 }, { AcPa_Id: 36, Pant_Id: 14, Acci_Id: 2 },
  { AcPa_Id: 37, Pant_Id: 14, Acci_Id: 3 }, { AcPa_Id: 38, Pant_Id: 14, Acci_Id: 5 }, { AcPa_Id: 39, Pant_Id: 15, Acci_Id: 1 }, { AcPa_Id: 40, Pant_Id: 15, Acci_Id: 2 },
  { AcPa_Id: 41, Pant_Id: 15, Acci_Id: 3 }, { AcPa_Id: 42, Pant_Id: 15, Acci_Id: 5 }, { AcPa_Id: 43, Pant_Id: 16, Acci_Id: 1 }, { AcPa_Id: 44, Pant_Id: 16, Acci_Id: 2 },
  { AcPa_Id: 45, Pant_Id: 16, Acci_Id: 3 }, { AcPa_Id: 46, Pant_Id: 16, Acci_Id: 5 }, { AcPa_Id: 47, Pant_Id: 17, Acci_Id: 1 }, { AcPa_Id: 48, Pant_Id: 17, Acci_Id: 2 },
  { AcPa_Id: 49, Pant_Id: 17, Acci_Id: 3 }, { AcPa_Id: 50, Pant_Id: 17, Acci_Id: 5 }, { AcPa_Id: 156, Pant_Id: 17, Acci_Id: 4 }, { AcPa_Id: 157, Pant_Id: 53, Acci_Id: 4 }, { AcPa_Id: 158, Pant_Id: 52, Acci_Id: 4 }, { AcPa_Id: 159, Pant_Id: 49, Acci_Id: 4 },
  { AcPa_Id: 160, Pant_Id: 22, Acci_Id: 4 }, { AcPa_Id: 161, Pant_Id: 34, Acci_Id: 4 }, { AcPa_Id: 162, Pant_Id: 34, Acci_Id: 9 }, { AcPa_Id: 188, Pant_Id: 18, Acci_Id: 4 }, { AcPa_Id: 189, Pant_Id: 19, Acci_Id: 4 }, { AcPa_Id: 190, Pant_Id: 20, Acci_Id: 4 },
  { AcPa_Id: 191, Pant_Id: 21, Acci_Id: 4 }, { AcPa_Id: 192, Pant_Id: 23, Acci_Id: 4 }, { AcPa_Id: 193, Pant_Id: 24, Acci_Id: 4 }, { AcPa_Id: 194, Pant_Id: 25, Acci_Id: 4 }, { AcPa_Id: 195, Pant_Id: 26, Acci_Id: 4 }, { AcPa_Id: 196, Pant_Id: 27, Acci_Id: 4 },
  { AcPa_Id: 197, Pant_Id: 28, Acci_Id: 4 }, { AcPa_Id: 198, Pant_Id: 29, Acci_Id: 4 }, { AcPa_Id: 199, Pant_Id: 30, Acci_Id: 4 }, { AcPa_Id: 200, Pant_Id: 31, Acci_Id: 4 }, { AcPa_Id: 201, Pant_Id: 32, Acci_Id: 4 }, { AcPa_Id: 202, Pant_Id: 33, Acci_Id: 4 },
  { AcPa_Id: 203, Pant_Id: 35, Acci_Id: 4 }, { AcPa_Id: 204, Pant_Id: 36, Acci_Id: 4 }, { AcPa_Id: 205, Pant_Id: 37, Acci_Id: 4 }, { AcPa_Id: 206, Pant_Id: 38, Acci_Id: 4 }, { AcPa_Id: 207, Pant_Id: 39, Acci_Id: 4 }, { AcPa_Id: 208, Pant_Id: 40, Acci_Id: 4 },
  { AcPa_Id: 209, Pant_Id: 41, Acci_Id: 4 }, { AcPa_Id: 210, Pant_Id: 42, Acci_Id: 4 }, { AcPa_Id: 211, Pant_Id: 43, Acci_Id: 4 }, { AcPa_Id: 212, Pant_Id: 45, Acci_Id: 4 }, { AcPa_Id: 213, Pant_Id: 6, Acci_Id: 4 }, { AcPa_Id: 214, Pant_Id: 7, Acci_Id: 4 },
  { AcPa_Id: 215, Pant_Id: 8, Acci_Id: 4 }, { AcPa_Id: 216, Pant_Id: 9, Acci_Id: 4 }, { AcPa_Id: 217, Pant_Id: 10, Acci_Id: 4 }, { AcPa_Id: 218, Pant_Id: 11, Acci_Id: 4 }, { AcPa_Id: 219, Pant_Id: 12, Acci_Id: 4 }, { AcPa_Id: 220, Pant_Id: 13, Acci_Id: 4 },
  { AcPa_Id: 221, Pant_Id: 14, Acci_Id: 4 }, { AcPa_Id: 222, Pant_Id: 15, Acci_Id: 4 }, { AcPa_Id: 223, Pant_Id: 16, Acci_Id: 4 }
];


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Rol>();

  treeData: TreeItem[] = [];
  selectedItems: TreeItem[] = [];

  rol: Rol = {
    role_Id: 0,
    role_Descripcion: '',
    usua_Creacion: 0,
    usua_Modificacion: 0,
    secuencia: 0,
    role_FechaCreacion: new Date(),
    role_FechaModificacion: new Date(),
    code_Status: 0,
    message_Status: '',
    usuarioCreacion: '',
    usuarioModificacion: '',
    role_Estado: true
  };

  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  constructor(private http: HttpClient) {
    this.cargarPantallas();
  }

  private cargarPantallas(): void {
    this.http.get(`${environment.apiBaseUrl}/Roles/ListarPantallas`, {
      headers: { 'x-api-key': environment.apiKey },
      responseType: 'text'
    }).subscribe({
      next: raw => {
        try {
          let data = raw.trim();
          if (!data.startsWith('[')) data = `[${data}]`;
          const parsed = JSON.parse(data);
          this.treeData = parsed.map((esquema: Esquema) => {
            const esquemaNode: TreeItem = {
              id: esquema.Esquema,
              name: esquema.Esquema,
              type: 'esquema',
              selected: false,
              expanded: true,
              children: []
            }; 
            esquemaNode.children = esquema.Pantallas.map((pantalla: Pantalla) => {
              const pantallaNode: TreeItem = {
                id: `${esquema.Esquema}_${pantalla.Pant_Id}`,
                name: pantalla.Pant_Descripcion,
                type: 'pantalla',
                selected: false,
                expanded: false,
                parent: esquemaNode,
                children: []
              };
              pantallaNode.children = pantalla.Acciones.map((accion: Accion) => ({
                id: `${pantalla.Pant_Id}_${accion.Acci_Id}`,
                name: accion.Accion,
                type: 'accion',
                selected: false,
                expanded: false,
                parent: pantallaNode
              }));
              return pantallaNode;
            });
            return esquemaNode;
          });
        } catch (e) {
          console.error('No se pudo parsear:', e);
        }
      },
      error: err => console.error('Error al cargar pantallas:', err)
    });
  }

  toggleSelection(item: TreeItem): void {
    item.selected = !item.selected;

    // Si selecciona un esquema o pantalla, propagar la selección a hijos
    if (item.type === 'esquema' || item.type === 'pantalla') {
      this.updateChildrenSelection(item, item.selected);
    }

    if (item.type === 'accion') {
      const pantalla = item.parent;
      const esquema = pantalla?.parent;

      if (item.selected) {
        if (pantalla) {
          pantalla.selected = true;
          pantalla.expanded = true;
        }
        if (esquema) {
          esquema.selected = true;
          esquema.expanded = true;
        }
      } else {
        // Si ya no hay acciones seleccionadas en la pantalla, desmarcarla
        if (pantalla && !pantalla.children?.some(acc => acc.selected)) {
          pantalla.selected = false;
          // Si tampoco hay pantallas seleccionadas en el esquema, desmarcarlo
          if (esquema && !esquema.children?.some(pant => pant.selected)) {
            esquema.selected = false;
          }
        }
      }
    }

    // Validar hacia arriba en caso de que se desmarque una pantalla
    if (item.type === 'pantalla') {
      const esquema = item.parent;

      if (item.selected) {
        if (esquema) {
          esquema.selected = true;
          esquema.expanded = true;
        }
      } else {
        // Si ninguna pantalla está seleccionada dentro del esquema, lo desmarcamos
        if (esquema && !esquema.children?.some(p => p.selected)) {
          esquema.selected = false;
        }
      }
    }

    // Validar hacia arriba si desmarcas un esquema no hace falta, ya se cubre

    this.updateSelectedItems();
  }

  private updateChildrenSelection(parent: TreeItem, selected: boolean): void {
    if (parent.children) {
      for (const child of parent.children) {
        child.selected = selected;
        child.expanded = selected; // expandir al seleccionar
        if (child.children) {
          this.updateChildrenSelection(child, selected);
        }
      }
    }
  }

  private updateSelectedItems(): void {
    this.selectedItems = this.getAllSelectedItems(this.treeData);
  }

  private getAllSelectedItems(items: TreeItem[]): TreeItem[] {
    return items.reduce<TreeItem[]>((acc, item) => {
      if (item.selected && item.type === 'accion') acc.push(item);
      if (item.children) acc.push(...this.getAllSelectedItems(item.children));
      return acc;
    }, []);
  }
  
  get hayExpandido(): boolean {
    return this.treeData.some(esquema => esquema.expanded || (esquema.children ? esquema.children.some(pantalla => pantalla.expanded) : false));
  }

  // estanExpandidoTodos = true; // por defecto todo expandido

  alternarDesplegables(): void {
    const expandir = !this.hayExpandido;

    const cambiarExpansion = (items: TreeItem[], expandir: boolean) => {
      for (const item of items) {
        item.expanded = expandir;
        if (item.children) {
          cambiarExpansion(item.children, expandir);
        }
      } 
    }

    cambiarExpansion(this.treeData, expandir);
  }

  guardar(): void {
    if (!this.rol.role_Descripcion.trim()) {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos.';
      setTimeout(() => this.mostrarAlertaWarning = false, 4000);
      return;
    }

    const rolInsertar = {
      role_Id: 0,
      role_Descripcion: this.rol.role_Descripcion.trim(),
      usua_Creacion: getUserId(),
      role_FechaCreacion: new Date().toISOString(),
      usua_Modificacion: 0,
      numero: '',
      role_FechaModificacion: new Date().toISOString(),
      usuarioCreacion: '',
      usuarioModificacion: '',
      role_Estado: true
    };

    this.http.post<Rol>(`${environment.apiBaseUrl}/Roles/Insertar`, rolInsertar, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: () => {
        this.http.get<Rol[]>(`${environment.apiBaseUrl}/Roles/Listar`, {
          headers: { 'X-Api-Key': environment.apiKey }
        }).subscribe({
          next: (roles) => {
            const ultimoRol = roles[0];

            const permisos = this.selectedItems
            .filter(item => item.type === 'accion')
            .map(item => {
              // Obtener el id de pantalla desde el padre y el id de acción desde el propio nodo
              const pantallaId = item.parent ? Number(item.parent.id.split('_').pop()) : undefined;
              const accionId = Number(item.id.split('_').pop());

              if (!pantallaId || !accionId) {
                console.warn(`No se pudo obtener Pant_Id o Accion_Id para item:`, item);
                return null;
              }

              const acPa = accionesPorPantalla.find(ap => ap.Pant_Id === pantallaId && ap.Acci_Id === accionId);
              if (!acPa) {
                console.warn(`No existe AcPa_Id para Pant_Id=${pantallaId} y Acci_Id=${accionId}`);
                return null;
              }
              return {
                acPa_Id: acPa.AcPa_Id,
                role_Id: ultimoRol.role_Id,
                usua_Creacion: getUserId(),
                perm_FechaCreacion: new Date().toISOString()
              };
            })
            .filter(permiso => permiso !== null);

            permisos.forEach(permiso => {
              this.http.post(`${environment.apiBaseUrl}/Insertar`, permiso, {
                headers: {
                  'X-Api-Key': environment.apiKey,
                  'Content-Type': 'application/json',
                  'accept': '*/*'
                }
              }).subscribe({
                error: err => {
                  this.mostrarAlertaError = true;
                  this.mensajeError = 'Error al guardar permisos.';
                  console.error(err);
                }
              });
            });

            // Enviar los permisos uno por uno
            permisos.forEach(permiso => {
              console.log('Permiso enviado:', permiso);
              this.http.post(`${environment.apiBaseUrl}/Insertar`, permiso, {
                headers: {
                  'X-Api-Key': environment.apiKey,
                  'Content-Type': 'application/json',
                  'accept': '*/*'
                }
              }).subscribe({
                error: err => {
                  this.mostrarAlertaError = true;
                  this.mensajeError = 'Error al guardar permisos.';
                  console.error(err);
                }
              });
            });

            this.mostrarAlertaExito = true;
            this.mensajeExito = `Rol y permisos guardados correctamente.`;
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(ultimoRol);
              this.cancelar();
            }, 3000);
          },
          error: () => {
            this.mostrarAlertaError = true;
            this.mensajeError = 'No se pudo obtener el último rol insertado.';
          }
        });
      },
      error: error => {
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al guardar el rol.';
        console.error(error);
      }
    });
  }

  cancelar(): void {
    this.clearSelections();
    this.rol = {
      role_Id: 0,
      role_Descripcion: '',
      usua_Creacion: 0,
      usua_Modificacion: 0,
      secuencia: 0,
      role_FechaCreacion: new Date(),
      role_FechaModificacion: new Date(),
      code_Status: 0,
      message_Status: '',
      usuarioCreacion: '',
      usuarioModificacion: '',
      role_Estado: true
    };
    this.onCancel.emit();
  }

  private clearSelections(): void {
    const clearNode = (node: TreeItem) => {
      node.selected = false;
      node.expanded = false;
      if (node.children) node.children.forEach(child => clearNode(child));
    };
    this.treeData.forEach(esq => clearNode(esq));
    this.selectedItems = [];
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mostrarAlertaError = false;
    this.mostrarAlertaWarning = false;
  }

  toggleExpand(item: TreeItem): void {
    item.expanded = !item.expanded;
  }
}