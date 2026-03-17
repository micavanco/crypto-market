import { Side } from '@core/types/side.type';

export interface Transaction {
  openTime: number;
  openPrice: number;
  swap: number;
  id: number;
  side: Side,
  size: number;
  profit: number;
}
