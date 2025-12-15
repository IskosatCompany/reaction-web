import { inject, Type, ViewContainerRef } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EMPTY, Observable, of, switchMap } from 'rxjs';
import { SessionsApiService } from '../api/sessions-api.service';
import { SessionsStore } from '../store/sessions.store';

/**
 * Base class for session-related actions.
 *
 * @typeParam T - Type of the result returned by the API.
 * @typeParam K - Type of the result returned by the BottomSheet.
 * @typeParam R - Type of the payload sent to the API.
 */
export abstract class SessionsActions<T, K, R> {
  readonly #bottomSheet = inject(MatBottomSheet);
  readonly #viewContainerRef = inject(ViewContainerRef);

  protected readonly apiService = inject(SessionsApiService);
  protected readonly store = inject(SessionsStore);

  /**
   * Opens a BottomSheet and maps its result to a payload
   * that can be used by the save operation.
   *
   * @typeParam C - BottomSheet component type.
   * @typeParam S - Data type passed to the BottomSheet.
   *
   * @param component - Component to be rendered inside the BottomSheet.
   * @param data - Optional data passed to the BottomSheet.
   *
   * @returns Observable that emits a save-ready payload (`R`).
   * @remarks If the BottomSheet is dismissed without a result,
   * the Observable completes without emitting any value.
   */
  protected openBottomSheet<S = object, C = unknown>(component: Type<C>, data?: S): Observable<R> {
    return this.#bottomSheet
      .open<C, S, K>(component, {
        data,
        restoreFocus: false,
        autoFocus: 'dialog',
        panelClass: 'session-bottom-sheet-container',
        viewContainerRef: this.#viewContainerRef
      })
      .afterDismissed()
      .pipe(
        switchMap((result) => {
          if (!result) {
            return EMPTY;
          }

          return of(this.mapBottomSheetResultToSave(result));
        })
      );
  }

  protected getSessionStartDateTime(startDate: Date, startTime: Date): Date {
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();

    return new Date(startDate.setHours(hours, minutes, 0, 0));
  }

  protected abstract save(...args: unknown[]): Observable<T>;
  protected abstract mapBottomSheetResultToSave(result: K): R;
}
