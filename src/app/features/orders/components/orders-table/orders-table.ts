import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProfitDirective } from '@shared/directives/profit.directive';
import { AppStore } from '@core/stores/app.store';

@Component({
  selector: 'app-orders-table',
  imports: [
    DatePipe,
    ProfitDirective
  ],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.css',
})
export class OrdersTable {
  #appStore = inject(AppStore);
  protected openedOrders = signal({} as Record<string, boolean>);
  protected orders = this.#appStore.orders;

  constructor() {
    this.#appStore.loadOrders();
  }

  protected toggleOrders(symbol: string): void {
    this.openedOrders.update(orders => {
      orders[symbol] = !orders[symbol];

      return { ...orders };
    })
  }
}
