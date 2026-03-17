import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProfitDirective } from '@shared/directives/profit.directive';

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
  protected openedOrders = signal({} as Record<string, boolean>);
  orders = [
    {
      symbol: "BTCUSD",
      openPriceTotal: 320432.5,
      sizeTotal: 0.04,
      swapTotal: -0.008,
      profitTotal: 11.2102,
      transactions: [
        {
          "openTime": 1750740422000,
          "openPrice": 104837.47,
          "swap": -0.00147939,
          "id": 1203384,
          "side": "BUY",
          "size": 0.05,
          profit: 23.432
        },
        {
          "openTime": 1769870131000,
          "openPrice": 81536.02,
          "swap": -6.55e-05,
          "id": 1226230,
          "side": "SELL",
          "size": 0.01,
          profit: -11.432
        },
      ]
    },
  ];

  protected toggleOrders(symbol: string): void {
    this.openedOrders.update(orders => {
      orders[symbol] = !orders[symbol];

      return { ...orders };
    })
  }
}
