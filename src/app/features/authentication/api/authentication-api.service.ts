import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api-url.token';
import { LoginRequest, LoginResponse } from '../models/login.interface';

@Injectable({ providedIn: 'root' })
export class AuthenticationApiService {
  readonly #http = inject(HttpClient);
  readonly #url = inject(API_URL);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.#http.post<LoginResponse>(`${this.#url}/auth/login`, request);
  }

  // logout(): Observable<unknown> {}

  // refresh(): Observable<unknown> {}
}
