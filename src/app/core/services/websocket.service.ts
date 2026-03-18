import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { WebsocketResponse } from '@core/interfaces/websocket-response.interface';
import { WebsocketRequest } from '@core/interfaces/websocket-request.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private readonly WS_URL = 'wss://webquotes.geeksoft.pl/websocket/quotes';
  private socket$ = webSocket(this.WS_URL);

  public quotes$ = this.socket$.asObservable() as Observable<WebsocketResponse>;

  public send(request: WebsocketRequest) {
    this.socket$.next(request);
  }

  public close() {
    this.socket$.complete();
  }
}
