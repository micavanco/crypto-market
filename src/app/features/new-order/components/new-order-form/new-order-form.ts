import { Component, inject } from '@angular/core';
import { AppStore } from '@core/stores/app.store';

@Component({
  selector: 'app-new-order-form',
  imports: [],
  templateUrl: './new-order-form.html',
  styleUrl: './new-order-form.css',
})
export class NewOrderForm {
  #appStore = inject(AppStore);
  protected orders = this.#appStore.orders;

  createNewOrder(): void {

  }
}
