import { Component, inject } from '@angular/core';
import { AppStore } from '@core/stores/app.store';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { moreThanNumberValidator } from '@shared/validators/more-than-number.validator';
import { Transaction } from '@core/interfaces/transaction.interface';
import { Side } from '@core/types/side.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-order-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './new-order-form.html',
  styleUrl: './new-order-form.css',
})
export class NewOrderForm {
  #appStore = inject(AppStore);
  #router = inject(Router);
  protected orders = this.#appStore.orders;

  protected newOrderForm = new FormGroup({
    symbol: new FormControl<string>('', [Validators.required]),
    side: new FormControl('BUY'),
    size: new FormControl('', [Validators.required, moreThanNumberValidator(0)]),
    openPrice: new FormControl('', [Validators.required, moreThanNumberValidator(0)]),
  });

  get size() {
    return this.newOrderForm.controls['size'];
  }

  get openPrice() {
    return this.newOrderForm.controls['openPrice'];
  }

  createNewOrder(): void {
    const lastTransaction = this.orders()
      .find(order => order.symbol === this.newOrderForm.value.symbol)
      ?.transactions[0];

    const newTransaction: Transaction = {
      openTime: new Date().getTime(),
      openPrice: parseFloat(this.newOrderForm.value.openPrice!),
      swap: Math.random(),
      id: lastTransaction ? (lastTransaction.id + 1) : 123456,
      side: this.newOrderForm.value.side as Side,
      size: parseFloat(this.newOrderForm.value.size!),
      sideMultiplier: this.newOrderForm.value.side === 'BUY' ? 1 : -1,
    };
    this.#appStore.createNewOrder(this.newOrderForm.value.symbol!, newTransaction);
    this.#router.navigate(['/']);
  }
}
