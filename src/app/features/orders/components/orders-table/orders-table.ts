import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProfitDirective } from '@shared/directives/profit.directive';
import { AppStore } from '@core/stores/app.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/components/snackbar.component';
import { Transaction } from '@core/interfaces/transaction.interface';
import { FormatNumberPipe } from '@shared/pipes/format-number.pipe';

@Component({
  selector: 'app-orders-table',
  imports: [
    DatePipe,
    ProfitDirective,
    FormatNumberPipe
  ],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.css',
})
export class OrdersTable {
  #appStore = inject(AppStore);
  #snackBar = inject(MatSnackBar);
  protected openedOrders = signal({} as Record<string, boolean>);
  protected orders = this.#appStore.orders;
  protected profitData = this.#appStore.profitData;

  constructor() {
    this.#appStore.loadData();
  }

  protected toggleOrders(symbol: string): void {
    this.openedOrders.update(orders => {
      orders[symbol] = !orders[symbol];

      return { ...orders };
    })
  }

  protected closeTransaction(symbol: string, transactionId: number): void {
    this.#appStore.closeTransaction(symbol, transactionId);
    this.#snackBar.openFromComponent(SnackbarComponent, {
      data: transactionId,
      duration: 2000,
    });
  }

  protected closeTransactionGroup(symbol: string, transactions: Transaction[]): void {
    this.#appStore.closeTransactionGroup(symbol);
    this.#snackBar.openFromComponent(SnackbarComponent, {
      data: transactions.map((transaction: Transaction) => transaction.id).join(', '),
      duration: 2000,
    });
  }
}
