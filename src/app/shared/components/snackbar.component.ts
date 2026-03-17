import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'snackbar',
  styles: `
    .snackbar {
      background: var(--snackbar-background-color);
      padding: 14px 8px 14px 16px;
      color: rgb(198, 210, 219);
      font-weight: 700;
    }
  `,
  template: '<div class="snackbar">Zamknięto zlecenie nr {{ transactions }}</div>',
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public transactions: string) {}
}
