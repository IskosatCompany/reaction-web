import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api-url.token';
import { SessionDto } from '../models/http/session-dto.interface';
import { SessionUpsertRequest } from '../models/http/session-upsert-request.interface';
import { SessionsRequest } from '../models/http/sessions-request.interface';

@Injectable({ providedIn: 'root' })
export class SessionsApiService {
  readonly #http = inject(HttpClient);
  readonly #url = inject(API_URL);

  getSessions(request: SessionsRequest): Observable<SessionDto[]> {
    let params = new HttpParams();
    if (request.startDate) {
      params = params.append('startDate', request.startDate);
    }

    if (request.endDate) {
      params = params.append('endDate', request.endDate);
    }

    if (request.clientId) {
      params = params.append('clientId', request.clientId);
    }

    if (request.coachId) {
      params = params.append('coachId', request.coachId);
    }

    return this.#http.get<SessionDto[]>(`${this.#url}/session`, { params });
  }

  getSessionDetails(sessionId: string): Observable<SessionDto> {
    return this.#http.get<SessionDto>(`${this.#url}/session/${sessionId}`);
  }

  addSession(payload: SessionUpsertRequest): Observable<SessionDto> {
    return this.#http.post<SessionDto>(`${this.#url}/session`, payload);
  }

  editSession(sessionId: string, payload: SessionUpsertRequest): Observable<SessionDto> {
    return this.#http.put<SessionDto>(`${this.#url}/session/${sessionId}`, payload);
  }

  deleteSession(sessionId: string): Observable<unknown> {
    return this.#http.delete(`${this.#url}/session/${sessionId}`);
  }
}
