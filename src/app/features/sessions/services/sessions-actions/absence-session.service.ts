import { Injectable } from '@angular/core';
import { SessionsActions } from '../../models/sessions-actions.class';
import { Observable } from 'rxjs';
import { SessionDto } from '../../models/http/session-dto.interface';

@Injectable()
export class AbsenceSessionService extends SessionsActions<SessionDto, void, void> {
  registerAbsence(id: string): Observable<SessionDto> {
    return this.save(id);
  }

  protected override save(id: string): Observable<SessionDto> {
    return this.apiService.sessionAbsence(id);
  }
  protected override mapBottomSheetResultToSave(result: void): void {
    throw new Error('Method not implemented.');
  }
}
