import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ConfirmActionComponent } from '../../../../ui/components/confirm-action/confirm-action.component';
import { ConfirmAction } from '../../../../ui/components/confirm-action/confirm-action.model';
import { SessionsActions } from '../../models/sessions-actions.class';

@Injectable()
export class DeleteSessionService extends SessionsActions<unknown, boolean, unknown> {
  delete(sessionId: string): Observable<unknown> {
    return super
      .openBottomSheet<ConfirmAction>(ConfirmActionComponent, {
        message: 'Apagar sessão?',
        buttonLabel: 'Apagar'
      })
      .pipe(switchMap(() => this.save(sessionId)));
  }

  protected override save(sessionId: string): Observable<unknown> {
    return this.apiService.deleteSession(sessionId);
  }

  protected override mapBottomSheetResultToSave(result: boolean): unknown {
    return result;
  }
}
