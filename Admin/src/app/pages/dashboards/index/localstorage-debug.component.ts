import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-localstorage-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">Depuración de LocalStorage</h5>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Clave</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of localStorageItems">
                <td>{{ item.key }}</td>
                <td>
                  <pre class="mb-0" style="max-height: 150px; overflow-y: auto;">{{ item.value }}</pre>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class LocalstorageDebugComponent implements OnInit {
  localStorageItems: { key: string; value: string }[] = [];

  ngOnInit(): void {
    this.loadLocalStorageItems();
  }

  loadLocalStorageItems(): void {
    this.localStorageItems = [];
    
    // Recorrer todas las claves en localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key) {
        let value = localStorage.getItem(key);
        
        // Intentar formatear JSON si es posible
        try {
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            const parsedValue = JSON.parse(value);
            value = JSON.stringify(parsedValue, null, 2);
          }
        } catch (e) {
          // Si no se puede parsear como JSON, dejarlo como está
          console.log('No se pudo parsear como JSON:', key);
        }
        
        this.localStorageItems.push({ key, value: value || '' });
      }
    }
  }
}
