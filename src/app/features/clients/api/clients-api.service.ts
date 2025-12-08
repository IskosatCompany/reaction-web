import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, ClientCreate, ClientForm } from '../models/client.interface';
import { API_URL } from '../../../core/tokens/api-url.token';

@Injectable({ providedIn: 'root' })
export class ClientsApiService {
  readonly #http = inject(HttpClient);
  readonly #apiUrl = inject(API_URL);

  getClients(searchTerm?: string): Observable<Client[]> {
    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    return this.#http.get<Client[]>(`${this.#apiUrl}/client`, { params });
  }

  createClient(client: Partial<ClientForm>): Observable<Client> {
    const clientCreateRequest: Partial<ClientCreate> = {
      address: client.address,
      email: client.email,
      name: client.name,
      phoneNumber: client.phoneNumber,
      nif: client.nif,
      birthDate: client.birthDate?.getTime() ?? undefined
    };
    return this.#http.post<Client>(`${this.#apiUrl}/client`, clientCreateRequest);
  }

  deleteClient(clientId: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/client/${clientId}`);
  }

  editClient(clientId: string, payload: Partial<ClientForm>): Observable<Client> {
    const clientCreateRequest: Partial<ClientCreate> = {
      address: payload.address,
      email: payload.email,
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      nif: payload.nif,
      birthDate: payload.birthDate?.getTime() ?? undefined
    };
    return this.#http.put<Client>(`${this.#apiUrl}/client/${clientId}`, clientCreateRequest);
  }

  editPlanning(clientId: string, planning: string): Observable<Client> {
    return this.#http.post<Client>(`${this.#apiUrl}/client/${clientId}/planning`, { planning });
  }

  getClientDetails(clientId: string): Observable<Client> {
    return this.#http.get<Client>(`${this.#apiUrl}/client/${clientId}`);
  }
}
