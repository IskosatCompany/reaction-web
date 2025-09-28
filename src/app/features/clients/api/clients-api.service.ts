import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../models/client.interface';

@Injectable()
export class ClientsApiService {
  readonly #http = inject(HttpClient);

  getClients(): Observable<Client[]> {
    return this.#http.get<Client[]>('api/client');
  }
}
