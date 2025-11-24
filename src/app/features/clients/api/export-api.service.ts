import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/tokens/api-url.token';
import { ExportPdfRequest } from '../models/export-pdf-request.interface';

@Injectable({ providedIn: 'root' })
export class ExportApiService {
  readonly #http = inject(HttpClient);
  readonly #apiUrl = inject(API_URL);

  exportPdf(request: ExportPdfRequest): Observable<Blob> {
    let params = new HttpParams()
      .append('clientId', request.clientId)
      .append('withSessions', request.withSessions)
      .append('withTreatments', request.withTreatments);

    if (request.startDate) {
      params = params.append('startDate', request.startDate);
    }

    if (request.endDate) {
      params = params.append('endDate', request.endDate);
    }

    return this.#http.get(`${this.#apiUrl}/export/pdf`, { params, responseType: 'blob' });
  }
}
