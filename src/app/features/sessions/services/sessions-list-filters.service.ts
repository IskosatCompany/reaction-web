import { Injectable } from '@angular/core';
import { subDays } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { SessionsRequest } from '../models/http/sessions-request.interface';
import { SessionStatus } from '../models/session.interface';

@Injectable()
export class SessionsListFiltersService {
  loadSessionsSubject = new BehaviorSubject(this.defaultRequest);
  request = { ...this.defaultRequest };

  get defaultRequest(): SessionsRequest {
    const defaultRequest: SessionsRequest = {
      startDate: subDays(new Date(), 7).getTime(),
      endDate: new Date().getTime(),
      status: SessionStatus.Pending
    };

    return defaultRequest;
  }

  updateRequest(request: SessionsRequest): void {
    this.request = { ...request };
    this.loadSessionsSubject.next(this.request);
  }

  reloadSessions(): void {
    this.loadSessionsSubject.next(this.request);
  }
}
