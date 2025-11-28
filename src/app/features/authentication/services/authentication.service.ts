import { computed, inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, EMPTY, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthenticationApiService } from '../api/authentication-api.service';
import { UserRole } from '../models/login.interface';

interface JwtPayload {
  account_id: string;
  exp: number;
  realm: UserRole;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  readonly #apiService = inject(AuthenticationApiService);

  readonly isAuthenticated = signal(false);
  readonly userRole = signal<UserRole>(UserRole.admin);
  readonly userId = signal<string>('');

  // TODO: remove this after implement permissions management
  readonly isAdmin = computed(
    () =>
      this.userRole() === UserRole.admin || this.userId() === '0c2ed097-e49f-4281-a745-670f175c38a7'
  );

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
    this.userRole.set(UserRole.admin);
    this.userId.set('');
  }

  getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  #getTokenData(): { role: UserRole; id: string } | null {
    const token = this.getAuthToken();
    if (!token) {
      return null;
    }

    const { account_id, realm } = jwtDecode<JwtPayload>(token);
    return { id: account_id, role: realm };
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
    this.userRole.set(tokenData.role);
  }
}
