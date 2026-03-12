import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, EMPTY, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthenticationApiService } from '../api/authentication-api.service';
import { Permission } from '../models/permissions.model';

interface JwtPayload {
  account_id: string;
  permissions: Permission[];
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  readonly #apiService = inject(AuthenticationApiService);

  readonly isAuthenticated = signal(false);
  readonly userPermissions = signal<Permission[]>([]);
  readonly userId = signal<string>('');

  initialize(): Observable<void> {
    const token = this.getAuthToken();
    if (!token) {
      return EMPTY;
    }

    return this.#apiService.validate().pipe(
      tap((isValid) => {
        if (!isValid) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
        }

        this.#setUserData();
      }),
      switchMap(() => EMPTY)
    );
  }

  login(email: string, password: string): Observable<unknown> {
    return this.#apiService.login({ email, password }).pipe(
      catchError((error) => throwError(() => error)),
      finalize(() => this.#setUserData()),
      tap(({ authToken, refreshToken }) => {
        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      })
    );
  }

  refresh(): Observable<unknown> {
    return this.#apiService.refresh().pipe(
      catchError((error) => throwError(() => error)),
      finalize(() => this.#setUserData()),
      tap(({ authToken, refreshToken }) => {
        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.isAuthenticated.set(false);
    this.userPermissions.set([]);
    this.userId.set('');
  }

  getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  #getTokenData(): { permissions: Permission[]; id: string } | null {
    const token = this.getAuthToken();
    if (!token) {
      return null;
    }

    const { account_id, permissions } = jwtDecode<JwtPayload>(token);
    return { id: account_id, permissions };
  }

  #setUserData(): void {
    const tokenData = this.#getTokenData();
    if (!tokenData) {
      // eslint-disable-next-line no-console
      console.warn('Token does not exist. Redirecting to login...');
      return;
    }

    this.isAuthenticated.set(true);
    this.userId.set(tokenData.id);
    this.userPermissions.set(tokenData.permissions);
  }
}
