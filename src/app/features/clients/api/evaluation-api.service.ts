import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api-url.token';
import { Evaluation } from '../models/evaluation/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationApiService {
  readonly #http = inject(HttpClient);
  readonly #apiUrl = inject(API_URL);

  getEvaluations(clientId: string): Observable<Evaluation[]> {
    const params = new HttpParams().append('clientId', clientId);
    return this.#http.get<Evaluation[]>(`${this.#apiUrl}/evaluation`, { params }).pipe(
      map((evaluations) =>
        evaluations.map((evaluation) => ({
          ...evaluation
        }))
      )
    );
  }

  addEvaluation(payload: Partial<Evaluation>): Observable<Evaluation> {
    return this.#http.post<Evaluation>(`${this.#apiUrl}/evaluation`, payload);
  }

  editEvaluation(evaluationId: string, payload: Partial<Evaluation>): Observable<Evaluation> {
    return this.#http.put<Evaluation>(`${this.#apiUrl}/evaluation/${evaluationId}`, payload);
  }

  deleteEvaluation(evaluationId: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/evaluation/${evaluationId}`);
  }
}
