import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiOrdersResponse } from '@core/interfaces/api-orders-response.interface';
import { ApiInstrumentsResponse } from '@core/interfaces/api-instruments-response.interface';
import { ApiContractTypesResponse } from '@core/interfaces/api-contract-types-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpClient: HttpClient = inject(HttpClient);
  private readonly API_URL = 'https://geeksoft.pl/assets/2026-task';

  loadOrders(): Observable<ApiOrdersResponse> {
    return this.httpClient.get<ApiOrdersResponse>(`${this.API_URL}/order-data.json`);
  }

  loadInstruments(): Observable<ApiInstrumentsResponse> {
    return this.httpClient.get<ApiInstrumentsResponse>(`${this.API_URL}/instruments.json`);
  }

  loadContractTypes(): Observable<ApiContractTypesResponse> {
    return this.httpClient.get<ApiContractTypesResponse>(`${this.API_URL}/contract-types.json`);
  }
}
