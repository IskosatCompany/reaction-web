import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api-url.token';
import { Client } from '../models/client.interface';

@Injectable()
export class ClientsApiService {
  readonly #http = inject(HttpClient);
  readonly #url = inject(API_URL);

  getClients(): Observable<Client[]> {
    return this.#http.get<Client[]>(`${this.#url}/client`);
  }
}
