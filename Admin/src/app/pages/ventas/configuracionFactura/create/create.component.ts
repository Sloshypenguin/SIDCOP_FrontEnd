import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  // Estados de alerta
  mostrarErrores = false;
  mostrarAlertaExito = false;
  mensajeExito = '';
  mostrarAlertaError = false;
  mensajeError = '';
  mostrarAlertaWarning = false;
  mensajeWarning = '';

  // Modelo
  configFactura = {
    coFa_Id: 0,
    coFa_NombreEmpresa: '',
    coFa_DireccionEmpresa: '',
    coFa_RTN: '',
    coFa_Correo: '',
    coFa_Telefono1: '',
    coFa_Telefono2: '',
    coFa_Logo: '',
    colo_Id: 0
  };

  // Catálogos
  Departamentos: any[] = [];
  TodosMunicipios: any[] = [];
  TodosColonias: any[] = [];

  Municipios: any[] = [];
  Colonias: any[] = [];

  selectedDepa: string = '';
  selectedMuni: string = '';

  constructor(private http: HttpClient) {
    this.cargarListados();
  }

  cargarListados(): void {
    this.http.get<any>(`${environment.apiBaseUrl}/Departamentos/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => this.Departamentos = data,
      error: (error) => console.error('Error cargando departamentos:', error)
    });

    this.http.get<any>(`${environment.apiBaseUrl}/Municipios/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => this.TodosMunicipios = data,
      error: (error) => console.error('Error cargando municipios:', error)
    });

    this.http.get<any>(`${environment.apiBaseUrl}/Colonia/Listar`, {
      headers: { 'x-api-key': environment.apiKey }
    }).subscribe({
      next: (data) => this.TodosColonias = data,
      error: (error) => console.error('Error cargando colonias:', error)
    });
  }

  cargarMunicipios(codigoDepa: string): void {
    this.Municipios = this.TodosMunicipios.filter(m => m.depa_Codigo === codigoDepa);
    this.Colonias = [];
    this.selectedMuni = '';
    this.configFactura.colo_Id = 0;
  }

  cargarColonias(codigoMuni: string): void {
    this.Colonias = this.TodosColonias.filter(c => c.muni_Codigo === codigoMuni);
    this.configFactura.colo_Id = 0;
    console.log("Colonias cargadas:", this.Colonias);
  }

  onImageSelected(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      const reader = new FileReader();
      reader.onload = () => {
        this.configFactura.coFa_Logo = reader.result as string;
      };
      reader.readAsDataURL(archivo);
    }
  }

  cerrarAlerta(): void {
    this.mostrarAlertaExito = false;
    this.mostrarAlertaWarning = false;
    this.mostrarAlertaError = false;
    this.mensajeExito = '';
    this.mensajeWarning = '';
    this.mensajeError = '';
  }

  cancelar(): void {
    this.cerrarAlerta();
    this.onCancel.emit();
  this.recargarPagina();
  }

  // Método para validar todos los campos obligatorios
  private validarCampos(): boolean {
    const camposObligatorios = [
      { campo: this.configFactura.coFa_NombreEmpresa.trim(), nombre: 'Nombre de la empresa' },
      { campo: this.configFactura.coFa_DireccionEmpresa.trim(), nombre: 'Dirección de la empresa' },
      { campo: this.configFactura.coFa_RTN.trim(), nombre: 'RTN' },
      { campo: this.configFactura.coFa_Correo.trim(), nombre: 'Correo electrónico' },
      { campo: this.configFactura.coFa_Telefono1.trim(), nombre: 'Teléfono principal' },
      { campo: this.configFactura.coFa_Logo, nombre: 'Logo' },
      { campo: this.selectedDepa, nombre: 'Departamento' },
      { campo: this.selectedMuni, nombre: 'Municipio' },
      { campo: this.configFactura.colo_Id, nombre: 'Colonia' }
    ];

    const camposVacios = camposObligatorios.filter(item => {
      // Para colo_Id verificamos que sea mayor a 0
      if (item.nombre === 'Colonia') {
        return item.campo === 0;
      }
      // Para el resto verificamos que no esté vacío
      return !item.campo;
    });

    if (camposVacios.length > 0) {
      const nombresCampos = camposVacios.map(item => item.nombre).join(', ');
      this.mensajeWarning = `Por favor complete los siguientes campos obligatorios: ${nombresCampos}`;
      this.mostrarAlertaWarning = true;
      this.mostrarAlertaError = false;
      this.mostrarAlertaExito = false;
      
      // Ocultar la alerta de warning después de 5 segundos
      setTimeout(() => {
        this.mostrarAlertaWarning = false;
        this.mensajeWarning = '';
      }, 5000);
      
      return false;
    }

    return true;
  }

  // Método para debugging (remover en producción)
  private debugResponse(response: any, isError: boolean = false): void {
    console.log('=== DEBUGGING RESPONSE ===');
    console.log('Es error:', isError);
    console.log('Tipo de respuesta:', typeof response);
    console.log('Respuesta completa:', response);
    
    if (response) {
      console.log('Propiedades del objeto:', Object.keys(response));
      
      if (response.body) {
        console.log('Body existe:', response.body);
        console.log('Tipo de body:', typeof response.body);
        console.log('Propiedades del body:', Object.keys(response.body));
      }
      
      if (response.data) {
        console.log('Data existe:', response.data);
        console.log('Propiedades de data:', Object.keys(response.data));
      }
    }
    console.log('=========================');
  }

  guardar(): void {
    this.mostrarErrores = true;
    this.cerrarAlerta(); // Cierra alertas previas

    // Validar campos obligatorios
    if (!this.validarCampos()) {
      return;
    }

    const body = {
      ...this.configFactura,
      usua_Creacion: environment.usua_Id,
      coFa_FechaCreacion: new Date().toISOString()
    };

    console.log('Enviando body:', body);

    this.http.post<any>(`${environment.apiBaseUrl}/ConfiguracionFactura/Insertar`, body, {
      headers: {
        'x-api-key': environment.apiKey,
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      observe: 'response'
    }).subscribe({
      next: (response) => {
        this.debugResponse(response, false);
        
        try {
          // Verifica si la petición fue exitosa por status HTTP
          if (response.status >= 200 && response.status < 300) {
            let codeStatus, messageStatus;
            const responseBody = response.body;
            
            // Maneja diferentes estructuras de respuesta
            if (responseBody && typeof responseBody === 'object') {
              if (responseBody.data) {
                codeStatus = responseBody.data.code_Status;
                messageStatus = responseBody.data.message_Status;
              } else if (responseBody.code_Status !== undefined) {
                codeStatus = responseBody.code_Status;
                messageStatus = responseBody.message_Status;
              } else if (responseBody.success !== undefined) {
                codeStatus = responseBody.success ? 1 : 0;
                messageStatus = responseBody.message || 'Operación completada';
              } else {
                // Si no hay estructura esperada, asume éxito por el status HTTP
                codeStatus = 1;
                messageStatus = 'Operación exitosa';
              }
            } else {
              // Si no hay body o no es objeto, asume éxito
              codeStatus = 1;
              messageStatus = 'Operación exitosa';
            }
            
            console.log('Code Status determinado:', codeStatus);
            console.log('Message Status:', messageStatus);
            
            if (codeStatus === 1 || codeStatus === true) {
              this.mensajeExito = 'Configuración guardada exitosamente';
              this.mostrarAlertaExito = true;
              this.mostrarErrores = false;
              
              setTimeout(() => {
                this.mostrarAlertaExito = false;
                this.onSave.emit();
                this.recargarPagina();
              }, 3000);
            } else {
              this.mensajeError = messageStatus || 'Error al guardar la configuración';
              this.mostrarAlertaError = true;
              this.mostrarAlertaExito = false;
              
              setTimeout(() => {
                this.mostrarAlertaError = false;
                this.mensajeError = '';
                this.recargarPagina();
              }, 5000);
            }
          } else {
            this.mensajeError = `Error en la respuesta del servidor (Status: ${response.status})`;
            this.mostrarAlertaError = true;
            this.mostrarAlertaExito = false;
            
            setTimeout(() => {
              this.mostrarAlertaError = false;
              this.mensajeError = '';
            }, 5000);
          }
        } catch (error) {
          console.error('Error procesando respuesta:', error);
          this.mensajeError = 'Error procesando la respuesta del servidor';
          this.mostrarAlertaError = true;
          this.mostrarAlertaExito = false;
          
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
        }
      },
      error: (error) => {
        this.debugResponse(error, true);
        
        try {
          // Maneja diferentes tipos de errores
          if (error.status === 200 || error.status === 201) {
            // A veces Angular considera 200/201 como error si la respuesta no es JSON válido
            this.mensajeExito = 'Configuración guardada exitosamente';
            this.mostrarAlertaExito = true;
            this.mostrarErrores = false;
            
            setTimeout(() => {
              this.mostrarAlertaExito = false;
              this.onSave.emit();
              this.recargarPagina();
            }, 3000);
          } else if (error.status === 0) {
            this.mensajeError = 'Error de conexión. Verifique su conexión a internet.';
            this.mostrarAlertaError = true;
            this.mostrarAlertaExito = false;
          } else if (error.status >= 400 && error.status < 500) {
            this.mensajeError = `Error del cliente (${error.status}). Verifique los datos enviados.`;
            this.mostrarAlertaError = true;
            this.mostrarAlertaExito = false;
          } else if (error.status >= 500) {
            this.mensajeError = `Error del servidor (${error.status}). Intente nuevamente más tarde.`;
            this.mostrarAlertaError = true;
            this.mostrarAlertaExito = false;
          } else {
            this.mensajeError = `Error al guardar la configuración. Status: ${error.status}`;
            this.mostrarAlertaError = true;
            this.mostrarAlertaExito = false;
          }
          
          // Ocultar alertas de error después de 5 segundos
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
        } catch (processingError) {
          console.error('Error procesando error:', processingError);
          this.mensajeError = 'Error inesperado al procesar la respuesta';
          this.mostrarAlertaError = true;
          this.mostrarAlertaExito = false;
          
          setTimeout(() => {
            this.mostrarAlertaError = false;
            this.mensajeError = '';
          }, 5000);
        }
      }
    });
  }

  private recargarPagina(): void {
    window.location.reload();
  }


}
