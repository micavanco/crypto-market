import { Transaction } from '@core/interfaces/transaction.interface';

export interface Order {
  symbol: string;
  openPriceTotal: number;
  sizeTotal: number;
  swapTotal: number;
  profitTotal: number;
  transactions: Transaction[];
}
