import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private dialogSubject = new BehaviorSubject<ConfirmationDialogData | null>(null);
  public dialog$: Observable<ConfirmationDialogData | null> = this.dialogSubject.asObservable();
  
  private resolveCallback?: (confirmed: boolean) => void;

  show(data: ConfirmationDialogData): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.resolveCallback = resolve;
      this.dialogSubject.next(data);
    });
  }

  confirm(): void {
    if (this.resolveCallback) {
      this.resolveCallback(true);
      this.resolveCallback = undefined;
    }
    this.dialogSubject.next(null);
  }

  cancel(): void {
    if (this.resolveCallback) {
      this.resolveCallback(false);
      this.resolveCallback = undefined;
    }
    this.dialogSubject.next(null);
  }
}

