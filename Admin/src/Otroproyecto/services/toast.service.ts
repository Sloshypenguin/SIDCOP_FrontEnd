import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  title: string;
  message: string;
  color: 'success' | 'danger' | 'warning' | 'info';
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();
  private counter = 0;

  constructor() {}

  show(title: string, message: string, color: 'success' | 'danger' | 'warning' | 'info' = 'success', delay: number = 5000): void {
    const id = this.counter++;
    const toast: Toast = { id, title, message, color, delay };
    this.toasts = [...this.toasts, toast];
    this.toastsSubject.next(this.toasts);

    // Auto remove after delay
    setTimeout(() => {
      this.remove(id);
    }, delay);
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(this.toasts);
  }
}
