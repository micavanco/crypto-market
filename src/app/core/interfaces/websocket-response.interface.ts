interface WebsocketQuote {
  s: string;
  b: number;
  a: number;
  t: number;
}

export interface WebsocketResponse {
  p: string;
  d: WebsocketQuote[];
}
