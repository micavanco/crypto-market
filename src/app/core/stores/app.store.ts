import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Order } from '@core/interfaces/order.interface';
import { Instrument } from '@core/interfaces/instrument.interface';
import { ContractType } from '@core/interfaces/contract-type.interface';
import { inject } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ApiOrdersResponse } from '@core/interfaces/api-orders-response.interface';

type OrdersState = {
  orders: Order[];
  instruments: Instrument[];
  contractTypes: ContractType[];
  isLoading: boolean;
};

const initialState: OrdersState = {
  orders: [],
  instruments: [],
  contractTypes: [],
  isLoading: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((
    store,
    apiService = inject(ApiService)
  ) => ({
    closeTransaction(symbol: string, transactionId: number): void {
      patchState(store, ({ orders }) => ({
        orders: orders.reduce((newOrders, order) => {
          if (order.symbol === symbol) {
            order.transactions = order.transactions
              .filter(transaction => transaction.id !== transactionId);
          }

          if (order.transactions && order.transactions.length > 0) {
            newOrders.push(order);
          }

          return newOrders;
        }, [] as Order[])
      }));
    },
    closeTransactionGroup(symbol: string): void {
      patchState(store, ({ orders }) => ({
        orders: orders.filter(order => order.symbol !== symbol),
      }));
    },
    loadOrders: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          return apiService.loadOrders().pipe(
            tapResponse({
              next: (orders) =>
                patchState(store, { orders: parseOrders(orders), isLoading: false }),
              error: (err) => {
                patchState(store, { isLoading: false });
                console.error(err);
              },
            })
          );
        })
      )
    ),
  }))
);

function parseOrders(apiResponse: ApiOrdersResponse): Order[] {
  const groupedBySymbol = Object
    .groupBy(apiResponse.data, ({ symbol }) => symbol);

  return Object.keys(groupedBySymbol).map(key => ({
    symbol: key,
    openPriceTotal: 0,
    sizeTotal: 0,
    swapTotal: 0,
    profitTotal: 0,
    transactions: groupedBySymbol[key]!.map(response => ({
      openTime: response.openTime,
      openPrice: response.openPrice,
      swap: response.swap,
      id: response.id,
      side: response.side,
      size: response.size,
      profit: 123
    }))
  }));
}
