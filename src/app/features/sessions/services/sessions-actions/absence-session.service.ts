import { Injectable } from '@angular/core';
import { SessionsActions } from '../../models/sessions-actions.class';
import { Observable, switchMap } from 'rxjs';
import { SessionDto } from '../../models/http/session-dto.interface';
import { ConfirmAction } from '../../../../ui/components/confirm-action/confirm-action.model';
import { ConfirmActionComponent } from '../../../../ui/components/confirm-action/confirm-action.component';

@Injectable()
export class AbsenceSessionService extends SessionsActions<SessionDto, boolean, unknown> {
  registerAbsence(sessionId: string): Observable<unknown> {
    return super
      .openBottomSheet<ConfirmAction>(ConfirmActionComponent, {
        message: 'Registar ausência?',
        buttonLabel: 'Confirmar'
      })
      .pipe(switchMap(() => this.save(sessionId)));
  }

  protected override save(sessionId: string): Observable<SessionDto> {
    return this.apiService.sessionAbsence(sessionId);
  }
  protected override mapBottomSheetResultToSave(result: boolean): unknown {
    return result;
  }
}
