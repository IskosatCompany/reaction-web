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
import { SessionsActions } from '../../models/sessions-actions.class';

@Injectable()
export class EditSessionService extends SessionsActions<
  SessionDto,
  SessionUpsertFormResult,
  SessionUpsertRequest
> {
  edit(sessionId: string): Observable<SessionDto> {
    return this.apiService.getSessionDetails(sessionId).pipe(
      switchMap((sessionDto) =>
        super.openBottomSheet<SessionUpsertData>(SessionUpsertComponent, {
          action: 'edit',
          session: {
            id: sessionDto.id,
            startDate: sessionDto.startDate,
            endDate: sessionDto.endDate,
            client: this.store.getClientById(sessionDto.clientId),
            coach: this.store.getCoachById(sessionDto.coachId)
          }
        })
      ),
      switchMap((payload) => this.save(sessionId, payload))
    );
  }

  protected override save(
    sessionId: string,
    request: SessionUpsertRequest
  ): Observable<SessionDto> {
    return this.apiService.editSession(sessionId, request);
  }

  protected override mapBottomSheetResultToSave(
    result: SessionUpsertFormResult
  ): SessionUpsertRequest {
    const { clientId, coachId, duration, startDate, startTime, sessionType } = result;
    const sessionStartDateTime = this.getSessionStartDateTime(startDate, startTime);

    return {
      clientId,
      coachId,
      type: sessionType,
      startDate: sessionStartDateTime.getTime(),
      endDate: addMinutes(sessionStartDateTime, duration).getTime()
    };
  }
}
