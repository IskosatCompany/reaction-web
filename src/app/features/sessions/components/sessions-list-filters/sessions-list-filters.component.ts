import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SessionsRequest } from '../../models/http/sessions-request.interface';
import { SessionStatus, SessionStatusLabel } from '../../models/session.interface';
import { SessionsStore } from '../../store/sessions.store';

interface SessionsListFiltersForm {
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  clientId: FormControl<string | null>;
  coachId: FormControl<string | null>;
  status: FormControl<SessionStatus | null>;
}

export interface SessionsListFiltersData {
  defaultRequest: SessionsRequest;
  isAbleToFilterByCoach: boolean;
}

@Component({
  selector: 'app-sessions-list-filters',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './sessions-list-filters.component.html',
  styleUrl: './sessions-list-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsListFiltersComponent {
  readonly #formBuilder = inject(FormBuilder);
  readonly #sessionsStore = inject(SessionsStore);
  readonly #bottomSheetRef = inject(MatBottomSheetRef, { optional: true });
  readonly #bottomSheetData = inject<SessionsListFiltersData>(MAT_BOTTOM_SHEET_DATA, {
    optional: true
  });

  readonly defaultRequest = input<SessionsRequest>(this.#bottomSheetData?.defaultRequest ?? {});
  readonly isAbleToFilterByCoach = input(this.#bottomSheetData?.isAbleToFilterByCoach ?? true);
  readonly filtersChanged = output<SessionsRequest>();

  readonly sessionStatus = SessionStatus;
  readonly sessionStatusLabel = SessionStatusLabel;
  readonly withinBottomSheet = signal(!!this.#bottomSheetRef);
  readonly filtersForm = this.#formBuilder.group<SessionsListFiltersForm>({
    startDate: this.#formBuilder.control<Date | null>(null),
    endDate: this.#formBuilder.control<Date | null>(null),
    clientId: this.#formBuilder.control<string | null>(null),
    coachId: this.#formBuilder.control<string | null>(null),
    status: this.#formBuilder.control<SessionStatus | null>(null)
  });

  // Clients
  readonly clients = this.#sessionsStore.clients;
  readonly clientFilterCtrl = new FormControl('');
  readonly clientFilter = toSignal(this.clientFilterCtrl.valueChanges, { initialValue: '' });
  readonly filteredClients = computed(() => {
    const search = this.clientFilter()?.toLowerCase();
    if (!search?.trim()) {
      return this.clients();
    }

    return this.clients().filter(
      (item) =>
        item.name.toLowerCase().includes(search) || item.clientNumber.toString().includes(search)
    );
  });

  // Coaches
  readonly coaches = this.#sessionsStore.coaches;
  readonly coachFilterCtrl = new FormControl('');
  readonly coachFilter = toSignal(this.coachFilterCtrl.valueChanges, { initialValue: '' });
  readonly filteredCoaches = computed(() => {
    const search = this.coachFilter()?.toLowerCase();
    if (!search?.trim()) {
      return this.coaches();
    }

    return this.coaches().filter(
      (item) =>
        item.name.toLowerCase().includes(search) || item.employeeNumber.toString().includes(search)
    );
  });

  constructor() {
    effect(() => {
      const { clientId, coachId, endDate, startDate, status } = this.defaultRequest();
      this.filtersForm.setValue({
        clientId: clientId ?? null,
        coachId: coachId ?? null,
        status: status ?? null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      });
    });
  }

  apply(): void {
    const request = this.#mapFiltersToSessionsRequest();
    if (this.#bottomSheetRef) {
      this.#bottomSheetRef.dismiss(request);
      return;
    }

    this.filtersChanged.emit(request);
  }

  reset(): void {
    const { clientId, coachId, endDate, startDate, status } = this.defaultRequest();

    this.filtersForm.reset({
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      clientId,
      coachId,
      status
    });

    this.apply();
  }

  close(): void {
    this.#bottomSheetRef?.dismiss();
  }

  #mapFiltersToSessionsRequest(): SessionsRequest {
    const { clientId, coachId, endDate, startDate, status } = this.filtersForm.getRawValue();

    return {
      clientId: clientId ?? undefined,
      coachId: coachId ?? undefined,
      startDate: startDate?.getTime(),
      endDate: endDate?.getTime(),
      status: status ?? undefined
    };
  }
}
