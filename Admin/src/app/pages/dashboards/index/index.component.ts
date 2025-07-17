import { Component } from '@angular/core';
import { LocalstorageDebugComponent } from './localstorage-debug.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  constructor() { }

  ngOnInit(): void {
    // No se requiere inicialización especial para el componente app-localstorage-debug
    // ya que es un componente standalone que maneja su propia lógica
  }
}
