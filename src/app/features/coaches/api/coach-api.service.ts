import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api-url.token';
import { Coach, CoachForm } from '../models/coach.model';

@Injectable({ providedIn: 'root' })
export class CoachApiService {
  readonly #http = inject(HttpClient);
  readonly #apiUrl = inject(API_URL);

  getCoaches(searchTerm?: string, showArchived = false): Observable<Coach[]> {
    // TODO: set to properly query param
    let params = new HttpParams().set('archived', showArchived);
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.#http.get<Coach[]>(`${this.#apiUrl}/coach`, { params });
  }

  getCoachDetails(coachId: string): Observable<Coach> {
    return this.#http.get<Coach>(`${this.#apiUrl}/coach/${coachId}`);
  }

  addCoach(coach: Partial<CoachForm>): Observable<Coach> {
    return this.#http.post<Coach>(`${this.#apiUrl}/coach`, coach);
  }

  editCoach(coachId: string, payload: Partial<CoachForm>): Observable<Coach> {
    return this.#http.put<Coach>(`${this.#apiUrl}/coach/${coachId}`, payload);
  }

  getExpertises(): Observable<string[]> {
    return this.#http.get<string[]>(`${this.#apiUrl}/coach/expertise`);
  }

  deleteCoach(coachId: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/coach/${coachId}`);
  }

  archiveCoach(coachId: string): Observable<Coach> {
    return this.#http.put<Coach>(`${this.#apiUrl}/coach/${coachId}/archive`, { archive: true });
  }

  unarchiveCoach(coachId: string): Observable<Coach> {
    return this.#http.put<Coach>(`${this.#apiUrl}/coach/${coachId}/archive`, { archive: false });
  }
}
