import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SessionsApiService } from '../api/sessions-api.service';
import { SessionUpsertComponent } from '../components/session-upsert/session-upsert.component';
import { SessionUpsertRequest } from '../models/http/session-upsert-request.interface';
import { Session } from '../models/session.interface';
import { CalendarService } from './calendar.service';

@Injectable()
export class UpsertSessionService {
  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #bottomSheet = inject(MatBottomSheet);
  readonly #apiService = inject(SessionsApiService);
  readonly #calendarService = inject(CalendarService);

  #bottomSheetRef?: MatBottomSheetRef;

  openBottomSheet(data: Partial<Session>): void {
    this.#bottomSheetRef = this.#bottomSheet.open<SessionUpsertComponent, Partial<Session>>(
      SessionUpsertComponent,
      {
        data,
        restoreFocus: false,
        autoFocus: 'dialog',
        panelClass: 'upsert-container',
        viewContainerRef: this.#viewContainerRef
      }
    );
  }

  closeBottomSheet(): void {
    this.#bottomSheetRef?.dismiss();
    this.#bottomSheetRef = undefined;
  }

  createSession(payload: SessionUpsertRequest): void {
    this.#apiService.addSession(payload).subscribe((sessionDto) => {
      this.#calendarService.addSession(sessionDto);
      this.closeBottomSheet();
    });
  }

  editSession(sessionId: string, payload: SessionUpsertRequest): void {
    this.#apiService.editSession(sessionId, payload).subscribe((sessionDto) => {
      this.#calendarService.updateSession(sessionDto);
      this.closeBottomSheet();
    });
  }

  deleteSession(sessionId: string): void {
    this.#apiService.deleteSession(sessionId).subscribe(() => {
      this.#calendarService.removeSession(sessionId);
      this.closeBottomSheet();
    });
  }
}
