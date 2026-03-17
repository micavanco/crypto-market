import { Component } from '@angular/core';
import { OrdersTable } from '@features/orders/components/orders-table/orders-table';

@Component({
  selector: 'app-orders-page',
  imports: [
    OrdersTable
  ],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.css',
})
export class OrdersPage {

}
