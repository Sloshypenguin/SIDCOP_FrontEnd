import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { PermisosService } from '../services/permisos.service';

@Directive({
  selector: '[appPermiso]',
  standalone: true
})
export class PermisoDirective implements OnInit {
  @Input() pantallaId: number = 0;
  @Input() accion: string = '';

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    private permisosService: PermisosService
  ) {}

  ngOnInit(): void {
    // Si no se especifica una acción, solo verificar acceso a la pantalla
    if (!this.accion) {
      if (!this.permisosService.tienePantallaPermiso(this.pantallaId)) {
        this.ocultarElemento();
      }
      return; // El elemento se mantiene visible si tiene permiso
    }
    
    // Verificar si tiene permiso para la acción específica
    if (!this.permisosService.tieneAccionPermiso(this.pantallaId, this.accion)) {
      this.ocultarElemento();
    }
  }

  private ocultarElemento(): void {
    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
  }
}
