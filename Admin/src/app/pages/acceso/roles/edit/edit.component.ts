import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Rol } from 'src/app/Modelos/acceso/roles.Model';
import { environment } from 'src/environments/environment';

interface Permiso {
  perm_Id: number;
  acPa_Id: number;
  role_Id: number;
  role_Descripcion: string;
  pant_Id: number;
  pant_Descripcion: string;
  acci_Id: number;
  acci_Descripcion: string;
  usua_Creacion: number;
  perm_FechaCreacion: string;
  usua_Modificacion: number;
  perm_FechaModificacion: string;
}

interface PermisoEliminar {
  perm_Id: number;
  usua_Creacion: number;
  perm_FechaCreacion: string;
  usua_Modificacion: number;
  perm_FechaModificacion: string;
}

interface PermisoInsertar {
  acPa_Id: number;
  role_Id: number;
  usua_Creacion: number;
  perm_FechaCreacion: string;
}

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
  { AcPa_Id: 49, Pant_Id: 17, Acci_Id: 3 }, { AcPa_Id: 50, Pant_Id: 17, Acci_Id: 5 }, { AcPa_Id: 51, Pant_Id: 18, Acci_Id: 1 }, { AcPa_Id: 52, Pant_Id: 18, Acci_Id: 2 },
  { AcPa_Id: 53, Pant_Id: 18, Acci_Id: 3 }, { AcPa_Id: 54, Pant_Id: 18, Acci_Id: 5 }, { AcPa_Id: 55, Pant_Id: 19, Acci_Id: 1 }, { AcPa_Id: 56, Pant_Id: 19, Acci_Id: 2 },
  { AcPa_Id: 57, Pant_Id: 19, Acci_Id: 3 }, { AcPa_Id: 58, Pant_Id: 19, Acci_Id: 5 }, { AcPa_Id: 59, Pant_Id: 20, Acci_Id: 1 }, { AcPa_Id: 60, Pant_Id: 20, Acci_Id: 2 },
  { AcPa_Id: 61, Pant_Id: 20, Acci_Id: 3 }, { AcPa_Id: 62, Pant_Id: 20, Acci_Id: 5 }, { AcPa_Id: 63, Pant_Id: 21, Acci_Id: 1 }, { AcPa_Id: 64, Pant_Id: 21, Acci_Id: 2 },
  { AcPa_Id: 65, Pant_Id: 21, Acci_Id: 3 }, { AcPa_Id: 66, Pant_Id: 21, Acci_Id: 5 }, { AcPa_Id: 67, Pant_Id: 22, Acci_Id: 1 }, { AcPa_Id: 68, Pant_Id: 22, Acci_Id: 2 },
  { AcPa_Id: 69, Pant_Id: 22, Acci_Id: 3 }, { AcPa_Id: 70, Pant_Id: 22, Acci_Id: 5 }, { AcPa_Id: 71, Pant_Id: 23, Acci_Id: 1 }, { AcPa_Id: 72, Pant_Id: 23, Acci_Id: 2 },
  { AcPa_Id: 73, Pant_Id: 23, Acci_Id: 3 }, { AcPa_Id: 74, Pant_Id: 23, Acci_Id: 5 }, { AcPa_Id: 75, Pant_Id: 24, Acci_Id: 1 }, { AcPa_Id: 76, Pant_Id: 24, Acci_Id: 2 },
  { AcPa_Id: 77, Pant_Id: 24, Acci_Id: 3 }, { AcPa_Id: 78, Pant_Id: 24, Acci_Id: 5 }, { AcPa_Id: 79, Pant_Id: 25, Acci_Id: 1 }, { AcPa_Id: 80, Pant_Id: 25, Acci_Id: 2 },
  { AcPa_Id: 81, Pant_Id: 25, Acci_Id: 3 }, { AcPa_Id: 82, Pant_Id: 25, Acci_Id: 5 }, { AcPa_Id: 83, Pant_Id: 26, Acci_Id: 1 }, { AcPa_Id: 84, Pant_Id: 26, Acci_Id: 2 },
  { AcPa_Id: 85, Pant_Id: 26, Acci_Id: 3 }, { AcPa_Id: 86, Pant_Id: 26, Acci_Id: 5 }, { AcPa_Id: 87, Pant_Id: 27, Acci_Id: 1 }, { AcPa_Id: 88, Pant_Id: 27, Acci_Id: 2 },
  { AcPa_Id: 89, Pant_Id: 27, Acci_Id: 3 }, { AcPa_Id: 90, Pant_Id: 27, Acci_Id: 5 }, { AcPa_Id: 91, Pant_Id: 28, Acci_Id: 1 }, { AcPa_Id: 92, Pant_Id: 28, Acci_Id: 2 },
  { AcPa_Id: 93, Pant_Id: 28, Acci_Id: 3 }, { AcPa_Id: 94, Pant_Id: 28, Acci_Id: 5 }, { AcPa_Id: 95, Pant_Id: 29, Acci_Id: 1 }, { AcPa_Id: 96, Pant_Id: 29, Acci_Id: 2 },
  { AcPa_Id: 97, Pant_Id: 29, Acci_Id: 3 }, { AcPa_Id: 98, Pant_Id: 29, Acci_Id: 5 }, { AcPa_Id: 99, Pant_Id: 30, Acci_Id: 1 }, { AcPa_Id: 100, Pant_Id: 30, Acci_Id: 2 },
  { AcPa_Id: 101, Pant_Id: 30, Acci_Id: 3 }, { AcPa_Id: 102, Pant_Id: 30, Acci_Id: 5 }, { AcPa_Id: 103, Pant_Id: 31, Acci_Id: 1 }, { AcPa_Id: 104, Pant_Id: 31, Acci_Id: 2 },
  { AcPa_Id: 105, Pant_Id: 31, Acci_Id: 3 }, { AcPa_Id: 106, Pant_Id: 31, Acci_Id: 5 }, { AcPa_Id: 107, Pant_Id: 32, Acci_Id: 1 }, { AcPa_Id: 108, Pant_Id: 32, Acci_Id: 2 },
  { AcPa_Id: 109, Pant_Id: 32, Acci_Id: 5 }, { AcPa_Id: 110, Pant_Id: 32, Acci_Id: 6 }, { AcPa_Id: 111, Pant_Id: 33, Acci_Id: 1 }, { AcPa_Id: 112, Pant_Id: 33, Acci_Id: 2 },
  { AcPa_Id: 113, Pant_Id: 33, Acci_Id: 3 }, { AcPa_Id: 114, Pant_Id: 33, Acci_Id: 5 }, { AcPa_Id: 115, Pant_Id: 34, Acci_Id: 1 }, { AcPa_Id: 116, Pant_Id: 34, Acci_Id: 2 },
  { AcPa_Id: 117, Pant_Id: 34, Acci_Id: 3 }, { AcPa_Id: 118, Pant_Id: 34, Acci_Id: 5 }, { AcPa_Id: 119, Pant_Id: 35, Acci_Id: 1 }, { AcPa_Id: 120, Pant_Id: 35, Acci_Id: 2 },
  { AcPa_Id: 121, Pant_Id: 35, Acci_Id: 3 }, { AcPa_Id: 122, Pant_Id: 35, Acci_Id: 5 }, { AcPa_Id: 123, Pant_Id: 36, Acci_Id: 1 }, { AcPa_Id: 124, Pant_Id: 36, Acci_Id: 2 },
  { AcPa_Id: 125, Pant_Id: 36, Acci_Id: 3 }, { AcPa_Id: 126, Pant_Id: 36, Acci_Id: 5 }, { AcPa_Id: 127, Pant_Id: 37, Acci_Id: 2 }, { AcPa_Id: 128, Pant_Id: 38, Acci_Id: 1 },
  { AcPa_Id: 129, Pant_Id: 38, Acci_Id: 2 }, { AcPa_Id: 130, Pant_Id: 38, Acci_Id: 3 }, { AcPa_Id: 131, Pant_Id: 38, Acci_Id: 5 }, { AcPa_Id: 132, Pant_Id: 39, Acci_Id: 1 },
  { AcPa_Id: 133, Pant_Id: 39, Acci_Id: 2 }, { AcPa_Id: 134, Pant_Id: 39, Acci_Id: 3 }, { AcPa_Id: 135, Pant_Id: 39, Acci_Id: 5 }, { AcPa_Id: 136, Pant_Id: 40, Acci_Id: 1 },
  { AcPa_Id: 137, Pant_Id: 40, Acci_Id: 2 }, { AcPa_Id: 138, Pant_Id: 40, Acci_Id: 5 }, { AcPa_Id: 139, Pant_Id: 40, Acci_Id: 6 }, { AcPa_Id: 140, Pant_Id: 41, Acci_Id: 1 },
  { AcPa_Id: 141, Pant_Id: 41, Acci_Id: 2 }, { AcPa_Id: 142, Pant_Id: 41, Acci_Id: 5 }, { AcPa_Id: 143, Pant_Id: 41, Acci_Id: 6 }, { AcPa_Id: 144, Pant_Id: 42, Acci_Id: 1 },
  { AcPa_Id: 145, Pant_Id: 42, Acci_Id: 2 }, { AcPa_Id: 146, Pant_Id: 42, Acci_Id: 3 }, { AcPa_Id: 147, Pant_Id: 42, Acci_Id: 5 }, { AcPa_Id: 148, Pant_Id: 43, Acci_Id: 1 },
  { AcPa_Id: 149, Pant_Id: 43, Acci_Id: 2 }, { AcPa_Id: 150, Pant_Id: 43, Acci_Id: 3 }, { AcPa_Id: 151, Pant_Id: 43, Acci_Id: 5 }, { AcPa_Id: 152, Pant_Id: 45, Acci_Id: 1 },
  { AcPa_Id: 153, Pant_Id: 45, Acci_Id: 2 }, { AcPa_Id: 154, Pant_Id: 45, Acci_Id: 3 }, { AcPa_Id: 155, Pant_Id: 45, Acci_Id: 5 }
];

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnChanges {
  @Input() rolData: Rol | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<Rol>();

  hayCambiosPermisos: boolean = false;

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

  rolOriginal = '';
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';
  mostrarConfirmacionEditar = false;

  treeData: TreeItem[] = [];
  permisosDelRol: string[] = []; // ids combinados "pant_Id_acci_Id" para marcar acciones
  permisosActuales: any[] = []; // permisos reales con perm_Id para eliminar
  selectedItems: TreeItem[] = [];

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rolData'] && changes['rolData'].currentValue) {
      this.rol = { ...changes['rolData'].currentValue };
      this.rolOriginal = this.rol.role_Descripcion || '';
      this.mostrarErrores = false;
      this.cerrarAlerta();
      this.cargarPermisos(); // cargar permisos para marcar el árbol
    }
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
              pantallaNode.children = pantalla.Acciones.map((accion: Accion) => {
                const accionIdCompuesto = `${pantalla.Pant_Id}_${accion.Acci_Id}`;
                return {
                  id: accionIdCompuesto,
                  name: accion.Accion,
                  type: 'accion',
                  selected: this.permisosDelRol.includes(accionIdCompuesto),
                  expanded: false,
                  parent: pantallaNode
                };
              });
              pantallaNode.selected = pantallaNode.children.some(c => c.selected);
              return pantallaNode;
            });
            esquemaNode.selected = esquemaNode.children.some(c => c.selected);
            this.updateSelectedItems();
            return esquemaNode;
          });
        } catch (e) {
          console.error('No se pudo parsear:', e);
        }
      },
      error: err => console.error('Error al cargar pantallas:', err)
    });
  }

  private cargarPermisos(): void {
    if (!this.rol.role_Id) {
      this.treeData = [];
      this.permisosDelRol = [];
      this.permisosActuales = [];
      return;
    }
    const permisoRequest: Permiso = {
      perm_Id: 0,
      acPa_Id: 0,
      role_Id: this.rol.role_Id,
      role_Descripcion: this.rol.role_Descripcion || '',
      pant_Id: 0,
      pant_Descripcion: '',
      acci_Id: 0,
      acci_Descripcion: '',
      usua_Creacion: environment.usua_Id,
      perm_FechaCreacion: new Date().toISOString(),
      usua_Modificacion: environment.usua_Id,
      perm_FechaModificacion: new Date().toISOString()
    };

    this.http.post<any[]>(`${environment.apiBaseUrl}/Buscar`, permisoRequest, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (permisos) => {
        this.permisosActuales = permisos;
        this.permisosDelRol = permisos.map(p => `${p.pant_Id}_${p.acci_Id}`);
        this.cargarPantallas();
        this.hayCambiosPermisos = false; 
      },
      error: (err) => {
        console.error('Error al cargar permisos del rol:', err);
        this.cargarPantallas();
      }
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

  estanExpandidoTodos = true;

  alternarDesplegables(): void {
    this.estanExpandidoTodos = !this.estanExpandidoTodos;

    const cambiarExpansion = (items: TreeItem[], expandir: boolean) => {
      for (const item of items) {
        item.expanded = expandir;
        if (item.children) {
          cambiarExpansion(item.children, expandir);
        }
      }
    };

    cambiarExpansion(this.treeData, this.estanExpandidoTodos);
  }

  validarEdicion(): void {
    this.mostrarErrores = true;

    if (this.rol.role_Descripcion.trim()) {
      // Verificar si hay cambios en los permisos
      const permisosActuales = this.selectedItems
        .filter(item => item.type === 'accion')
        .map(item => {
          const pantallaId = item.parent ? Number(item.parent.id.split('_').pop()) : undefined;
          const accionId = Number(item.id.split('_').pop());
          return `${pantallaId}_${accionId}`;
        });

      this.hayCambiosPermisos = JSON.stringify(this.permisosDelRol) !== JSON.stringify(permisosActuales);

      if (this.rol.role_Descripcion.trim() !== this.rolOriginal || this.hayCambiosPermisos) {
        this.mostrarConfirmacionEditar = true;
      } else {
        this.mostrarAlertaWarning = true;
        this.mensajeWarning = 'No se han detectado cambios.';
        setTimeout(() => this.cerrarAlerta(), 4000);
      }
    } else {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
    }
  }

  cancelarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
  }

  confirmarEdicion(): void {
    this.mostrarConfirmacionEditar = false;
    this.guardar();
  }

  private getPermisosSeleccionados(): PermisoInsertar[] {
    return this.selectedItems
      .filter(item => item.type === 'accion')
      .map(item => {
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
          role_Id: this.rol.role_Id,
          usua_Creacion: environment.usua_Id,
          perm_FechaCreacion: new Date().toISOString()
        };
      })
      .filter(p => p !== null) as PermisoInsertar[];
  }

  private guardar(): void {
    this.mostrarErrores = true;

    if (!this.rol.role_Descripcion.trim()) {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => this.cerrarAlerta(), 4000);
      return;
    }

    const rolActualizar = {
      role_Id: this.rol.role_Id,
      role_Descripcion: this.rol.role_Descripcion.trim(),
      usua_Creacion: this.rol.usua_Creacion,
      role_FechaCreacion: this.rol.role_FechaCreacion,
      usua_Modificacion: environment.usua_Id,
      numero: this.rol.secuencia || '',
      role_FechaModificacion: new Date().toISOString(),
      usuarioCreacion: '',
      usuarioModificacion: ''
    };

    this.http.put<any>(`${environment.apiBaseUrl}/Roles/Actualizar`, rolActualizar, {
      headers: {
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: () => {
        const permisosNuevos = this.getPermisosSeleccionados();

        // Filtrar permisos que deben eliminarse (están en actuales pero no en nuevos)
        const permisosAEliminar = this.permisosActuales.filter(pActual => {
          const idActual = `${pActual.pant_Id}_${pActual.acci_Id}`;
          return !permisosNuevos.some(pNuevo => {
            if (!pNuevo) return false; // <-- Validación para evitar error TS18047
            const ap = accionesPorPantalla.find(ap => ap.AcPa_Id === pNuevo.acPa_Id);
            if (!ap) return false;
            return idActual === `${ap.Pant_Id}_${ap.Acci_Id}`;
          });
        });

        // Filtrar permisos que deben insertarse (están en nuevos pero no en actuales)
        const permisosAInsertar = permisosNuevos.filter(pNuevo => {
          if (!pNuevo) return false; // <-- Validación para evitar error TS18047
          const ap = accionesPorPantalla.find(ap => ap.AcPa_Id === pNuevo.acPa_Id);
          if (!ap) return false;
          const idNuevo = `${ap.Pant_Id}_${ap.Acci_Id}`;
          return !this.permisosActuales.some(pActual => `${pActual.pant_Id}_${pActual.acci_Id}` === idNuevo);
        });

        // Crear promesas para eliminar
        const promesasEliminar = permisosAEliminar.map(pEliminar => {
          const permisoEliminar: PermisoEliminar = {
            perm_Id: pEliminar.perm_Id,
            usua_Creacion: environment.usua_Id,
            perm_FechaCreacion: new Date().toISOString(),
            usua_Modificacion: environment.usua_Id,
            perm_FechaModificacion: new Date().toISOString()
          };
          return this.http.post(`${environment.apiBaseUrl}/Eliminar`, permisoEliminar, {
            headers: {
              'X-Api-Key': environment.apiKey,
              'Content-Type': 'application/json'
            }
          }).toPromise();
        });

        // Crear promesas para insertar
        const promesasInsertar = permisosAInsertar.map(pInsertar => {
          const permisoInsertar: PermisoInsertar = {
            acPa_Id: pInsertar.acPa_Id,
            role_Id: pInsertar.role_Id,
            usua_Creacion: environment.usua_Id,
            perm_FechaCreacion: new Date().toISOString()
          };
          return this.http.post(`${environment.apiBaseUrl}/Insertar`, permisoInsertar, {
            headers: {
              'X-Api-Key': environment.apiKey,
              'Content-Type': 'application/json',
              'accept': '*/*'
            }
          }).toPromise();
        });

        // Ejecutar todas promesas
        Promise.all([...promesasEliminar, ...promesasInsertar])
          .then(() => {
            this.mensajeExito = 'Rol y permisos actualizados correctamente';
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;

            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit(this.rol);
              this.cancelar();
            }, 3000);
          })
          .catch(error => {
            console.error('Error al actualizar permisos:', error);
            this.mostrarAlertaError = true;
            this.mensajeError = 'Error al actualizar los permisos. Por favor intente nuevamente.';
            setTimeout(() => this.cerrarAlerta(), 5000);
          });
      },
      error: (error) => {
        console.error('Error al actualizar rol:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = 'Error al actualizar el rol. Por favor, intente nuevamente.';
        setTimeout(() => this.cerrarAlerta(), 5000);
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
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }

  toggleExpand(item: TreeItem): void {
    item.expanded = !item.expanded;
  }
}
