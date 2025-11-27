import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SessionsRequest } from '../../models/http/sessions-request.interface';
import { SessionStatus, SessionStatusLabel } from '../../models/session.interface';
import { SessionsListFiltersService } from '../../services/sessions-list-filters.service';
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
  readonly #sessionsFiltersService = inject(SessionsListFiltersService);
  readonly #bottomSheetRef = inject(MatBottomSheetRef, { optional: true });

  readonly isAbleToFilterByCoach = this.#sessionsFiltersService.isAdmin;
  readonly sessionStatus = SessionStatus;
  readonly sessionStatusLabel = SessionStatusLabel;
  readonly withinBottomSheet = signal(!!this.#bottomSheetRef);
  readonly filtersForm: FormGroup<SessionsListFiltersForm>;

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
    const { clientId, coachId, endDate, startDate, status } = this.#sessionsFiltersService.request;

    this.filtersForm = this.#formBuilder.group<SessionsListFiltersForm>({
      startDate: this.#formBuilder.control<Date | null>(startDate ? new Date(startDate) : null),
      endDate: this.#formBuilder.control<Date | null>(endDate ? new Date(endDate) : null),
      clientId: this.#formBuilder.control<string | null>(clientId ?? null),
      coachId: this.#formBuilder.control<string | null>(coachId ?? null),
      status: this.#formBuilder.control<SessionStatus | null>(status ?? null)
    });
  }

  apply(): void {
    const request = this.#mapFiltersToSessionsRequest();

    this.#sessionsFiltersService.updateRequest(request);
    this.#bottomSheetRef?.dismiss();
  }

  reset(): void {
    const { clientId, coachId, endDate, startDate, status } =
      this.#sessionsFiltersService.defaultRequest;

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
