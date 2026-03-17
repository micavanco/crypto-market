interface InstrumentResponse {
  symbol: string;
  contractType: number;
}

export interface ApiInstrumentsResponse extends Array<InstrumentResponse> {}
