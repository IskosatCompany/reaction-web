import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Evaluation, EvaluationForm, UpsertEvaluation } from '../models/evaluation.interface';
import { API_URL } from '../../../core/tokens/api-url.token';

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
          ...evaluation,
          date: new Date(evaluation.date)
        }))
      )
    );
  }

  addEvaluation(payload: Partial<EvaluationForm>): Observable<Evaluation> {
    const evaluationRequest: Partial<UpsertEvaluation> = {
      title: payload.title,
      date: payload.date ? payload.date.getTime() : null,
      description: payload.description,
      coachId: payload.coachId,
      clientId: payload.clientId
    };
    return this.#http.post<Evaluation>(`${this.#apiUrl}/evaluation`, evaluationRequest);
  }

  editEvaluation(evaluationId: string, payload: Partial<EvaluationForm>): Observable<Evaluation> {
    const evaluationRequest: Partial<UpsertEvaluation> = {
      title: payload.title,
      date: payload.date ? payload.date.getTime() : null,
      description: payload.description,
      coachId: payload.coachId,
      clientId: payload.clientId
    };
    return this.#http.put<Evaluation>(
      `${this.#apiUrl}/evaluation/${evaluationId}`,
      evaluationRequest
    );
  }

  deleteEvaluation(evaluationId: string): Observable<void> {
    return this.#http.delete<void>(`${this.#apiUrl}/evaluation/${evaluationId}`);
  }
}
