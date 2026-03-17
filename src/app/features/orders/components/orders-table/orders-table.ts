import { Component } from '@angular/core';

@Component({
  selector: 'app-orders-table',
  imports: [],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.css',
})
export class OrdersTable {
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
  ]
}
