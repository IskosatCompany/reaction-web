import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, EMPTY, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { PermissionsApiService } from '../../permissions/api/permissions-api.service';
import { AuthenticationApiService } from '../api/authentication-api.service';
import { Permission } from '../models/permissions.model';

interface JwtPayload {
  account_id: string;
  employee_id: string;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  readonly #apiService = inject(AuthenticationApiService);
  readonly #permissionsApiService = inject(PermissionsApiService);

  readonly isAuthenticated = signal(false);
  readonly userPermissions = signal<Permission[]>([]);
  readonly userId = signal<string>('');
  readonly employeeId = signal<string>('');

  initialize(): Observable<unknown> {
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
      switchMap(() => this.updateUserPermissions())
    );
  }

  login(email: string, password: string): Observable<unknown> {
    return this.#apiService.login({ email, password }).pipe(
      catchError((error) => throwError(() => error)),
      tap(({ authToken, refreshToken }) => {
        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        this.#setUserData();
      }),
      switchMap(() => this.updateUserPermissions())
    );
  }

  refresh(): Observable<unknown> {
    return this.#apiService.refresh().pipe(
      catchError((error) => throwError(() => error)),
      tap(({ authToken, refreshToken }) => {
        localStorage.setItem(TOKEN_KEY, authToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        this.#setUserData();
      }),
      switchMap(() => this.updateUserPermissions())
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

  updateUserPermissions(): Observable<unknown> {
    return this.#permissionsApiService.getUserPermissions(this.userId()).pipe(
      tap((permissions) => this.userPermissions.set(permissions)),
      switchMap(() => of({}))
    );
  }

  #getTokenData(): { id: string; employeeId: string } | null {
    const token = this.getAuthToken();
    if (!token) {
      return null;
    }

    const { account_id, employee_id } = jwtDecode<JwtPayload>(token);
    return { id: account_id, employeeId: employee_id };
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
    this.employeeId.set(tokenData.employeeId);
  }
}
