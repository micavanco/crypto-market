import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { Order } from '@core/interfaces/order.interface';
import { Instrument } from '@core/interfaces/instrument.interface';
import { ContractType } from '@core/interfaces/contract-type.interface';
import { inject } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ApiOrdersResponse } from '@core/interfaces/api-orders-response.interface';
import { WebSocketService } from '@core/services/websocket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type OrdersState = {
  orders: Order[];
  instruments: Instrument[];
  contractTypes: ContractType[];
  symbolsForStream: string[];
  currentQuotes: Record<string, number>;
  isLoading: boolean;
};

const initialState: OrdersState = {
  orders: [],
  instruments: [],
  contractTypes: [],
  symbolsForStream: [],
  currentQuotes: {},
  isLoading: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks({
    onInit(store) {
      const webSocketService = inject(WebSocketService);

      webSocketService.quotes$
        .pipe(takeUntilDestroyed())
        .subscribe(response => {
          patchState(store, {
            currentQuotes: response.d.reduce((parsedObject, quote) => {
              parsedObject[quote.s] = quote.b;

              return parsedObject;
            }, {} as Record<string, number>)
          });
        });
    }
  }),
  withMethods((
    store,
    apiService = inject(ApiService),
    webSocketService = inject(WebSocketService)
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
    openQuotesStream(symbols: string[]): void {
      if (!symbols || symbols.length === 0) {
        return;
      }

      webSocketService.send({
        p: '/subscribe/addlist', d: symbols
      });
      patchState(store, { symbolsForStream: symbols });
    },
    closeQuotesStream(symbols: string[]): void {
      if (!symbols || symbols.length === 0) {
        return;
      }

      webSocketService.send({
        p: '/subscribe/removelist', d: symbols
      });
      patchState(store,
        ({ symbolsForStream }) =>
          ({ symbolsForStream: symbolsForStream.filter(symbol => !symbols.includes(symbol)) }));
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
    loadContractTypes: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          return apiService.loadContractTypes().pipe(
            tapResponse({
              next: (contractTypes) =>
                patchState(store, { contractTypes, isLoading: false }),
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
