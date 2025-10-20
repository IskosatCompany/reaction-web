import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api-url.token';

@Injectable({ providedIn: 'root' })
export class PasswordApiService {
  readonly #http = inject(HttpClient);
  readonly #url = inject(API_URL);

  resetPassword(token: string, password: string): Observable<unknown> {
    return this.#http.post(`${this.#url}/password/reset`, { token, password });
  }

  recoverPassword(email: string): Observable<unknown> {
    return this.#http.post(`${this.#url}/password/request-reset`, { email });
  }

  updatePassword(currentPassword: string, newPassword: string): Observable<unknown> {
    return this.#http.patch(`${this.#url}/password`, { currentPassword, newPassword });
  }
}
