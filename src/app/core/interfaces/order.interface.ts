import { Transaction } from '@core/interfaces/transaction.interface';

export interface Order {
  symbol: string;
  openPriceTotal: number;
  sizeTotal: number;
  swapTotal: number;
  contractSize: number;
  transactions: Transaction[];
}
