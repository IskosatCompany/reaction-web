import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api-url.token';
import { Permission } from '../../authentication/models/permissions.model';

@Injectable({ providedIn: 'root' })
export class PermissionsApiService {
  readonly #http = inject(HttpClient);
  readonly #apiUrl = inject(API_URL);

  getUsers(): Observable<{ id: string; name: string }[]> {
    return this.#http.get<{ id: string; name: string }[]>(`${this.#apiUrl}/user/list`);
  }

  getUserPermissions(userId: string): Observable<Permission[]> {
    return this.#http.get<Permission[]>(`${this.#apiUrl}/user/${userId}/permissions`);
  }

  updateUserPermissions(
    userId: string,
    permissions: Permission[]
  ): Observable<{ name: Permission }[]> {
    return this.#http.put<{ name: Permission }[]>(`${this.#apiUrl}/user/${userId}/permissions`, {
      permissions
    });
  }
}
