import { Component } from '@angular/core';
import { NewOrderForm } from '@features/new-order/components/new-order-form/new-order-form';

@Component({
  selector: 'app-new-order-page',
  imports: [
    NewOrderForm
  ],
  templateUrl: './new-order-page.html',
  styleUrl: './new-order-page.css',
})
export class NewOrderPage {

}
