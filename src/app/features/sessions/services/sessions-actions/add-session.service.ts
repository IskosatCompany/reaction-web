import { Injectable } from '@angular/core';
import { addMinutes } from 'date-fns';
import { Observable, switchMap } from 'rxjs';
import {
  SessionUpsertComponent,
  SessionUpsertData,
  SessionUpsertFormResult
} from '../../components/session-upsert/session-upsert.component';
import { SessionDto } from '../../models/http/session-dto.interface';
import { SessionUpsertRequest } from '../../models/http/session-upsert-request.interface';
import { Session } from '../../models/session.interface';
import { SessionsActions } from '../../models/sessions-actions.class';

@Injectable()
export class AddSessionService extends SessionsActions<
  SessionDto,
  SessionUpsertFormResult,
  SessionUpsertRequest
> {
  add(data: Partial<Session>): Observable<SessionDto> {
    return super
      .openBottomSheet<SessionUpsertData>(SessionUpsertComponent, {
        action: 'create',
        session: data
      })
      .pipe(switchMap((result) => this.save(result)));
  }

  protected override save(request: SessionUpsertRequest): Observable<SessionDto> {
    return this.apiService.addSession(request);
  }

  protected override mapBottomSheetResultToSave(
    result: SessionUpsertFormResult
  ): SessionUpsertRequest {
    const { clientId, coachId, duration, startDate, startTime } = result;
    const sessionStartDateTime = this.getSessionStartDateTime(startDate, startTime);

    return {
      clientId,
      coachId,
      startDate: sessionStartDateTime.getTime(),
      endDate: addMinutes(sessionStartDateTime, duration).getTime()
    };
  }
}
