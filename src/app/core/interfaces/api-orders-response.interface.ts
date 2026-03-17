import { Side } from '@core/types/side.type';

export interface OrderResponse {
  openTime: number;
  openPrice: number;
  swap: number;
  id: number;
  symbol: string;
  side: Side;
  size: number;
}

export interface ApiOrdersResponse {
  data: OrderResponse[];
}
