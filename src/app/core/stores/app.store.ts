import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Order } from '@core/interfaces/order.interface';
import { inject } from '@angular/core';
import { ApiService } from '@core/services/api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, throttleTime, zip } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { ApiOrdersResponse } from '@core/interfaces/api-orders-response.interface';
import { WebSocketService } from '@core/services/websocket.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiInstrumentsResponse } from '@core/interfaces/api-instruments-response.interface';
import { ApiContractTypesResponse } from '@core/interfaces/api-contract-types-response.interface';
import { Transaction } from '@core/interfaces/transaction.interface';

type OrdersState = {
  orders: Order[];
  currentQuotes: Record<string, number>;
  isLoading: boolean;
};

const initialState: OrdersState = {
  orders: [],
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
        .pipe(
          throttleTime(300),
          takeUntilDestroyed()
        )
        .subscribe(response => {
          if (response.d) {
            patchState(store, ({ currentQuotes }) => ({
              currentQuotes: response.d.reduce((parsedObject, quote) => {
                parsedObject[quote.s] = quote.b;

                return parsedObject;
              }, { ...currentQuotes })
            }));
          }
        });
    }
  }),
  withComputed(({ orders, currentQuotes }) => ({
    profitData: () => {
      return orders().reduce((output, current) => {
        const { profits, totalProfit } = parseProfitOfTransactions(
          current.transactions,
          currentQuotes()[current.symbol],
          current.contractSize,
        );

        output[current.symbol] = {
          totalProfit,
          profits
        };

        return output;
      }, {} as Record<string, { totalProfit: number; profits: Record<string, number> }>)
    },
  })),
  withMethods((
    store,
    apiService = inject(ApiService),
    webSocketService = inject(WebSocketService)
  ) => ({
    closeTransaction(symbol: string, transactionId: number): void {
      patchState(store, ({ orders }) => {
        const symbolsToRemove: string[] = [];
        const newOrders = orders.reduce((newOrders, order) => {
          if (order.symbol === symbol) {
            order.transactions = order.transactions
              .filter(transaction => transaction.id !== transactionId);
          }

          if (order.transactions && order.transactions.length > 0) {
            newOrders.push(recalculateTotals(order));
          } else {
            symbolsToRemove.push(order.symbol);
          }

          return newOrders;
        }, [] as Order[]);

        if (symbolsToRemove.length > 0) {
          this.closeQuotesStream(symbolsToRemove);
        }

        return {
          orders: newOrders,
        }
      });
    },
    closeTransactionGroup(symbol: string): void {
      this.closeQuotesStream([symbol]);
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
      patchState(store, ({ currentQuotes }) => ({
        currentQuotes: symbols.reduce((result, symbol) => {
          result[symbol] = 0;

          return result;
        }, currentQuotes),
      }));
    },
    closeQuotesStream(symbols: string[]): void {
      if (!symbols || symbols.length === 0) {
        return;
      }

      webSocketService.send({
        p: '/subscribe/removelist', d: symbols
      });
    },
    createNewOrder(symbol: string, transaction: Transaction): void {
      patchState(store, ({ orders }) => ({
          orders: orders.reduce((result, current) => {
            if (current.symbol === symbol) {
              current.transactions = [transaction, ...current.transactions];
              current = recalculateTotals(current);
            }

            result.push(current);

            return result;
          }, [] as Order[])
        })
      );
    },
    loadData: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          return zip([apiService.loadInstruments(), apiService.loadContractTypes()]);
        }),
        switchMap(([instruments, contractTypes]) => {
          return apiService.loadOrders().pipe(
            tapResponse({
              next: (orders) => {
                const symbols: string[] = orders.data.map(d => d.symbol);

                webSocketService.send({
                  p: '/subscribe/addlist', d: symbols
                });

                patchState(store, {
                  orders: parseOrders(orders, instruments, contractTypes),
                  isLoading: false,
                  currentQuotes: symbols
                    .reduce((result, symbol) => {
                      result[symbol] = 0;

                      return result;
                    }, {} as Record<string, number>)
                });
              },
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

function parseOrders(
  apiResponse: ApiOrdersResponse,
  apiInstruments: ApiInstrumentsResponse,
  apiContractTypes: ApiContractTypesResponse
): Order[] {
  const groupedBySymbol = Object
    .groupBy(apiResponse.data, ({ symbol }) => symbol);

  return Object.keys(groupedBySymbol).map(key => {
    const contractType: number = apiInstruments
      .find(instrument => instrument.symbol === key)?.contractType || 0;
    const contractSize = apiContractTypes
      .find(type => type.contractType === contractType)?.contractSize || 1;
    let openPriceTotal = 0;
    let sizeTotal = 0;
    let swapTotal = 0;
    const transactions: Transaction[] = [];

    for (let response of groupedBySymbol[key]!) {
      const sideMultiplier = response.side === 'BUY' ? 1 : -1;
      sizeTotal += (response.size * sideMultiplier);
      openPriceTotal += (response.openPrice  * sideMultiplier);
      swapTotal += response.swap;
      transactions.push(({
        openTime: response.openTime,
        openPrice: response.openPrice,
        swap: response.swap,
        id: response.id,
        side: response.side,
        size: response.size,
        sideMultiplier: response.side === 'BUY' ? 1 : -1
      }));
    }

    openPriceTotal = openPriceTotal / transactions.length;

    return {
      symbol: key,
      contractSize,
      openPriceTotal,
      sizeTotal,
      swapTotal,
      transactions
    }
  });
}

function recalculateTotals(order: Order) {
    let openPriceTotal = 0;
    let sizeTotal = 0;
    let swapTotal = 0;


    for (let transaction of order.transactions) {
      sizeTotal += transaction.size;
      openPriceTotal += transaction.openPrice;
      swapTotal += transaction.swap;
    }

    openPriceTotal = openPriceTotal / order.transactions.length;

    return {
      ...order,
      openPriceTotal,
      sizeTotal,
      swapTotal,
    };
}

function parseProfitOfTransactions(
  transactions: Transaction[],
  priceBid: number,
  contractSize: number
): { profits: Record<string, number>; totalProfit: number } {
  let totalProfit = 0;
  const profits = transactions.reduce((output, current) => {
    output[current.id] = (priceBid - current.openPrice) * contractSize * current.size * current.sideMultiplier;
    totalProfit += output[current.id];

    return output;
  }, {} as Record<string, number>)


  return {
    profits,
    totalProfit
  };
}
