import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalstorageDebugComponent } from './localstorage-debug.component';
import { PermisosDebugComponent } from '../permisos-debug/permisos-debug.component';
import { PermisosEjemploComponent } from '../permisos-ejemplo/permisos-ejemplo.component';
import { environment } from '../../../../environments/environment.prod';
import { getUserId, getUserName, getUserRole } from '../../../core/utils/user-utils';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  // Datos de usuario
  usuarioId: string | number = '';
  nombreUsuario: string = '';
  rolUsuario: string = '';
  ultimoAcceso: Date | null = null;
  
  // Datos de entorno
  apiUrl: string = '';
  authMode: string = '';
  appVersion: string = '';
  isProd: boolean = false;
  entorno: string = '';

  constructor() { }

  ngOnInit(): void {
    this.cargarDatosSesion();
  }

  cargarDatosSesion(): void {
    // Obtener datos del usuario usando las funciones de utilidad
    const userId = getUserId();
    this.usuarioId = userId > 0 ? userId : 'No disponible';
    this.nombreUsuario = getUserName() || 'No disponible';
    this.rolUsuario = getUserRole() || 'No disponible';
    
    const ultimoAccesoStr = localStorage.getItem('ultimoAcceso');
    if (ultimoAccesoStr) {
      try {
        this.ultimoAcceso = new Date(ultimoAccesoStr);
      } catch (e) {
        this.ultimoAcceso = new Date();
      }
    } else {
      this.ultimoAcceso = new Date();
    }

    // Obtener datos del entorno
    this.apiUrl = environment.apiBaseUrl || 'No configurada';
    this.authMode = environment.defaultauth || 'No configurado';
    this.appVersion = '1.0.0'; // Versión de la aplicación
    
    // Determinar si estamos en producción
    const isProduction = window.location.hostname !== 'localhost' && 
                        !window.location.hostname.includes('127.0.0.1');
    this.isProd = isProduction;
    this.entorno = isProduction ? 'Producción' : 'Desarrollo';
  }
}
