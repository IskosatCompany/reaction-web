import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { DeleteSessionConfirmationComponent } from '../../components/delete-session-confirmation/delete-session-confirmation.component';
import { SessionsActions } from '../../models/sessions-actions.class';

@Injectable()
export class DeleteSessionService extends SessionsActions<unknown, boolean, unknown> {
  delete(sessionId: string): Observable<unknown> {
    return super
      .openBottomSheet(DeleteSessionConfirmationComponent)
      .pipe(switchMap(() => this.save(sessionId)));
  }

  protected override save(sessionId: string): Observable<unknown> {
    return this.apiService.deleteSession(sessionId);
  }

  protected override mapBottomSheetResultToSave(result: boolean): unknown {
    return result;
  }
}
