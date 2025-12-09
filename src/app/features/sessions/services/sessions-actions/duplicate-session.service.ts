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
export class DuplicateSessionService extends SessionsActions<
  SessionDto,
  SessionUpsertFormResult,
  SessionUpsertRequest
> {
  duplicate(sessionId: string): Observable<SessionDto> {
    return this.apiService.getSessionDetails(sessionId).pipe(
      switchMap((sessionDto) => {
        const { startDate, endDate } = this.#getStartAndEndDates(
          sessionDto.startDate,
          sessionDto.endDate
        );

        return super.openBottomSheet<SessionUpsertData>(SessionUpsertComponent, {
          action: 'duplicate',
          session: {
            startDate,
            endDate,
            client: this.store.getClientById(sessionDto.clientId),
            coach: this.store.getCoachById(sessionDto.coachId)
          }
        });
      }),
      switchMap((result) => this.save(result))
    );
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

  #getStartAndEndDates(startDate: number, endDate: number): { startDate: number; endDate: number } {
    const today = new Date();
    const sessionStartDate = new Date(startDate);
    const sessionEndDate = new Date(endDate);

    return {
      startDate: new Date(
        today.setHours(sessionStartDate.getHours(), sessionStartDate.getMinutes())
      ).getTime(),
      endDate: new Date(
        today.setHours(sessionEndDate.getHours(), sessionEndDate.getMinutes())
      ).getTime()
    };
  }
}
