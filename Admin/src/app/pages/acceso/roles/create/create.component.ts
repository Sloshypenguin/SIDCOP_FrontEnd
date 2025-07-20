import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Rol } from 'src/app/Modelos/acceso/roles.Model';
import { environment } from 'src/environments/environment';

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
  Accion_Id: number;
  Accion: string;
}

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
  
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  treeData: TreeItem[] = [];
  selectedItems: TreeItem[] = [];

  constructor(private http: HttpClient) {
    this.cargarPantallas();
  }

  private cargarPantallas(): void {
    // Realiza una petición GET para obtener la lista de pantallas
    this.http.get(`${environment.apiBaseUrl}/Roles/ListarPantallas`, {
      headers: { 'x-api-key': environment.apiKey },
      responseType: 'text'
    }).subscribe({
      next: raw => {
        try {
          // Limpia espacios y ajusta el formato si la respuesta no es un array
          let data = raw.trim();
          if (!data.startsWith('[')) {
            data = `[${data}]`;
          }
          // Parsea la respuesta y la asigna a 'esquemas'
          const parsed = JSON.parse(data);
          
          // Construye la estructura del TreeView
          this.treeData = parsed.map((esquema: Esquema) => ({
            id: esquema.Esquema,
            name: esquema.Esquema,
            type: 'esquema',
            selected: false,
            expanded: false, // Iniciar con todos los nodos colapsados
            children: esquema.Pantallas.map((pantalla: Pantalla) => ({
              id: `${esquema.Esquema}_${pantalla.Pant_Id}`,
              name: pantalla.Pant_Descripcion,
              type: 'pantalla',
              selected: false,
              expanded: false, // Iniciar con todos los nodos colapsados
              children: pantalla.Acciones.map((accion: Accion) => ({
                id: `${esquema.Esquema}_${pantalla.Pant_Id}_${accion.Accion_Id}`,
                name: accion.Accion,
                type: 'accion',
                selected: false
              }))
            }))
          }));
        } catch (e) {
          console.error('No se pudo parsear la respuesta de pantallas:', e, raw);
        }
      },
      error: err => {
        console.error('Error al cargar pantallas:', err);
      }
    });
  }

  toggleSelection(item: TreeItem): void {
    item.selected = !item.selected;
    
    // Si es una acción o pantalla, selecciona/deselecciona todas sus acciones
    if (item.type === 'pantalla' || item.type === 'esquema') {
      this.updateChildrenSelection(item);
    }
    
    this.updateSelectedItems();
  }

  toggleExpand(item: TreeItem): void {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    }
  }

  private updateChildrenSelection(parent: TreeItem): void {
    if (parent.children) {
      const newState = parent.selected;
      parent.children.forEach(child => {
        child.selected = newState;
        if (child.children) {
          this.updateChildrenSelection(child);
        }
      });
    }
  }

  private updateSelectedItems(): void {
    this.selectedItems = this.getAllSelectedItems(this.treeData);
  }

  private getAllSelectedItems(items: TreeItem[]): TreeItem[] {
    return items.reduce<TreeItem[]>((acc, item) => {
      if (item.selected) {
        acc.push(item);
      }
      if (item.children) {
        acc.push(...this.getAllSelectedItems(item.children));
      }
      return acc;
    }, []);
  }

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

  guardar(): void {
    if (!this.rol.role_Descripcion.trim()) {
      this.mostrarAlertaWarning = true;
      this.mensajeWarning = 'Por favor complete todos los campos requeridos antes de guardar.';
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 4000);
      return;
    }

    // Preparar los datos seleccionados para enviar
    const seleccionados = this.selectedItems.map(item => ({
      esquema: item.type === 'esquema' ? item.name : item.parent?.name,
      pantalla: item.type === 'pantalla' ? item.name : item.parent?.name,
      accion: item.type === 'accion' ? item.name : null
    }));

    // Enviar datos seleccionados a otro endpoint
    console.log('Datos seleccionados:', seleccionados);

    // Preparar datos del rol para guardar
    const rolGuardar = {
      role_Id: 0,
      role_Descripcion: this.rol.role_Descripcion.trim(),
      usua_Creacion: environment.usua_Id,
      role_FechaCreacion: new Date().toISOString(),
      usua_Modificacion: 0,
      numero: "", 
      role_FechaModificacion: new Date().toISOString(),
      usuarioCreacion: "", 
      usuarioModificacion: "" 
    };

    this.http.post<Rol>(`${environment.apiBaseUrl}/Roles/Insertar`, rolGuardar, {
      headers: { 
        'X-Api-Key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      }
    }).subscribe({
      next: (response: Rol) => {
        this.mostrarAlertaExito = true;
        this.mensajeExito = `Rol "${this.rol.role_Descripcion}" guardado exitosamente`;
        
        // Ocultar la alerta después de 3 segundos
        setTimeout(() => {
          this.mostrarAlertaExito = false;
          this.onSave.emit(response);
          this.cancelar();
        }, 3000);
      },
      error: (error: any) => {
        console.error('Error al guardar el rol:', error);
        this.mostrarAlertaError = true;
        this.mensajeError = error.error?.message || 'Error al guardar el rol. Por favor, intente nuevamente.';
        
        // Ocultar la alerta de error después de 5 segundos
        setTimeout(() => {
          this.mostrarAlertaError = false;
          this.mensajeError = '';
        }, 5000);
      }
    });
  }

  private clearSelections(): void {
    const clearNode = (node: TreeItem) => {
      node.selected = false;
      node.expanded = false; // Agregado: también resetea el estado de expansión
      if (node.children) {
        node.children.forEach(child => clearNode(child));
      }
    };
    
    this.treeData.forEach(esquema => clearNode(esquema));
    this.selectedItems = [];
  }

  cancelar(): void {
    this.mostrarErrores = false;
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
    
    // Limpiar selecciones del TreeView
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

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mensajeExito = '';
    this.mostrarAlertaError = false;
    this.mensajeError = '';
    this.mostrarAlertaWarning = false;
    this.mensajeWarning = '';
  }
}
