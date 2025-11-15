import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ConfirmationDialogService, ConfirmationDialogData } from '../../services/confirmation-dialog.service';
import { APP_MESSAGES } from '../../constants/app.messages';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('200ms ease-in')),
      transition('* => void', animate('150ms ease-out'))
    ]),
    trigger('popIn', [
      state('void', style({ 
        transform: 'scale(0.7) translateY(20px)', 
        opacity: 0 
      })),
      state('*', style({ 
        transform: 'scale(1) translateY(0)', 
        opacity: 1 
      })),
      transition('void => *', [
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({
          transform: 'scale(1.05) translateY(0)',
          opacity: 1
        })),
        animate('150ms ease-out', style({
          transform: 'scale(1) translateY(0)'
        }))
      ]),
      transition('* => void', [
        animate('200ms ease-in', style({
          transform: 'scale(0.9) translateY(10px)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  dialogData: ConfirmationDialogData | null = null;
  private subscription?: Subscription;
  readonly APP_MESSAGES = APP_MESSAGES;

  constructor(private confirmationService: ConfirmationDialogService) {}

  ngOnInit(): void {
    this.subscription = this.confirmationService.dialog$.subscribe(data => {
      this.dialogData = data;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  confirm(): void {
    this.confirmationService.confirm();
  }

  cancel(): void {
    this.confirmationService.cancel();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (this.dialogData) {
      this.cancel();
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent): void {
    if (this.dialogData && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.confirm();
    }
  }
}

