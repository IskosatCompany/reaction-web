import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AddSessionReportComponent } from '../../components/add-session-report/add-session-report.component';
import { SessionDto } from '../../models/http/session-dto.interface';
import { SessionsActions } from '../../models/sessions-actions.class';

@Injectable()
export class CloseSessionService extends SessionsActions<
  SessionDto,
  [string, boolean],
  [string, boolean]
> {
  close(sessionId: string): Observable<SessionDto> {
    return super
      .openBottomSheet(AddSessionReportComponent)
      .pipe(switchMap((result) => this.save(sessionId, result)));
  }

  protected override save(sessionId: string, result: [string, boolean]): Observable<SessionDto> {
    const [report, saveAsDraft] = result;
    return saveAsDraft
      ? this.apiService.saveReportDraft(sessionId, { report })
      : this.apiService.closeSession(sessionId, { report });
  }

  protected override mapBottomSheetResultToSave(result: [string, boolean]): [string, boolean] {
    return result;
  }
}
