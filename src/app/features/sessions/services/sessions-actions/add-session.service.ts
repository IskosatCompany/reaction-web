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
  add(data: Partial<Session>, sessionTypes: string[]): Observable<SessionDto> {
    if (!data.startDate || !data.endDate) {
      throw new Error('Start date and end date must be provided to add a session');
    }
    return this.apiService.getSessionLocations(data.startDate, data.endDate).pipe(
      switchMap((possibleLocations) =>
        super.openBottomSheet<SessionUpsertData>(SessionUpsertComponent, {
          action: 'create',
          session: data,
          sessionTypes,
          possibleLocations,
          fetchLocations: (start, end) => this.apiService.getSessionLocations(start, end)
        })
      ),
      switchMap((result) => this.save(result))
    );
  }

  protected override save(request: SessionUpsertRequest): Observable<SessionDto> {
    return this.apiService.addSession(request);
  }

  protected override mapBottomSheetResultToSave(
    result: SessionUpsertFormResult
  ): SessionUpsertRequest {
    const { clientId, coachId, duration, startDate, startTime, sessionType, location } = result;
    const sessionStartDateTime = this.getSessionStartDateTime(startDate, startTime);

    return {
      clientId,
      coachId,
      location,
      type: sessionType,
      startDate: sessionStartDateTime.getTime(),
      endDate: addMinutes(sessionStartDateTime, duration).getTime()
    };
  }
}
