import { inject, Injectable } from '@angular/core';
import { subDays } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { UserRole } from '../../authentication/models/login.interface';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { SessionsRequest } from '../models/http/sessions-request.interface';
import { SessionStatus } from '../models/session.interface';

@Injectable()
export class SessionsListFiltersService {
  readonly #authService = inject(AuthenticationService);

  loadSessionsSubject = new BehaviorSubject(this.defaultRequest);
  request = { ...this.defaultRequest };
  isAdmin = this.#authService.isAdmin;

  get defaultRequest(): SessionsRequest {
    const defaultRequest: SessionsRequest = {
      startDate: subDays(new Date(), 7).getTime(),
      endDate: new Date().getTime()
    };

    if (this.#authService.userRole() === UserRole.coach) {
      defaultRequest.status = SessionStatus.Pending;
    }

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
