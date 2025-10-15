import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthenticationApiService } from '../api/authentication-api.service';

const TOKEN_KEY = 'jwt_token';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  readonly #apiService = inject(AuthenticationApiService);

  readonly isAuthenticated = signal(false);

  constructor() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      this.isAuthenticated.set(true);
    }
  }

  login(email: string, password: string): Observable<unknown> {
    // TODO: handle invalid credentials (handle API error)
    return this.#apiService.login({ email, password }).pipe(
      catchError((error) => throwError(() => error)),
      tap(({ jwt }) => {
        localStorage.setItem(TOKEN_KEY, jwt);
        this.isAuthenticated.set(true);
      })
    );
  }

  // TODO: missing API call
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isAuthenticated.set(false);
  }

  // TODO: missing refresh token

  getJwtToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}
