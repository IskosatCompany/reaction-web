import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AddSessionReportComponent } from '../../components/add-session-report/add-session-report.component';
import { CloseSessionRequest } from '../../models/http/close-session-request.interface';
import { SessionDto } from '../../models/http/session-dto.interface';
import { SessionsActions } from '../../models/sessions-actions.class';

@Injectable()
export class CloseSessionService extends SessionsActions<SessionDto, string, CloseSessionRequest> {
  close(sessionId: string): Observable<SessionDto> {
    return super
      .openBottomSheet(AddSessionReportComponent)
      .pipe(switchMap((result) => this.save(sessionId, result)));
  }

  protected override save(sessionId: string, request: CloseSessionRequest): Observable<SessionDto> {
    return this.apiService.closeSession(sessionId, request);
  }

  protected override mapBottomSheetResultToSave(result: string): CloseSessionRequest {
    return { report: result };
  }
}
