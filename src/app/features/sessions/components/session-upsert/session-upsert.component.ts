import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  addMinutes,
  differenceInMinutes,
  getMinutes,
  isBefore,
  roundToNearestMinutes
} from 'date-fns';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { merge, Observable, switchMap, take } from 'rxjs';
import { FormatClientPipe } from '../../../../ui/pipes/format-client.pipe';
import { FormatCoachPipe } from '../../../../ui/pipes/format-coach.pipe';
import { Permission } from '../../../authentication/models/permissions.model';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Session } from '../../models/session.interface';
import { SessionsStore } from '../../store/sessions.store';

export interface SessionUpsertData {
  action: Action;
  session: Partial<Session>;
  sessionTypes: string[];
  possibleLocations?: string[];
  fetchLocations: (startDate: number, endDate: number) => Observable<string[]>;
}

export interface SessionUpsertFormResult {
  startDate: Date;
  startTime: Date;
  duration: number;
  clientId: string;
  coachId: string;
  sessionType: string;
  location: string;
}

interface SessionUpsertForm {
  startDate: FormControl<Date>;
  startTime: FormControl<Date>;
  duration: FormControl<number>; // 30 minutes or 60 minutes -> default 60 minutes
  sessionType: FormControl<string>;
  clientId: FormControl<string>;
  coachId: FormControl<string>;
  location: FormControl<string>;
}

type Action = 'create' | 'edit' | 'duplicate';

@Component({
  selector: 'app-session-upsert',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    NgxMatSelectSearchModule,
    MatTooltipModule,
    FormatClientPipe,
    FormatCoachPipe
  ],
  templateUrl: './session-upsert.component.html',
  styleUrl: './session-upsert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionUpsertComponent {
  readonly #data = inject<SessionUpsertData>(MAT_BOTTOM_SHEET_DATA);
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #sessionsStore = inject(SessionsStore);
  readonly #authService = inject(AuthenticationService);
  readonly #bottomSheetRef = inject(MatBottomSheetRef);
  readonly #destroyRef = inject(DestroyRef);

  sessionTypes = this.#data.sessionTypes ?? [];
  possibleLocations = signal<string[]>([]);
  currentLocation = signal(this.#data.session.location);
  form: FormGroup<SessionUpsertForm>;

  get title(): string {
    const titleLabels: Record<Action, string> = {
      create: 'Nova Sessão',
      edit: this.#data.session.client?.name ?? 'Editar Sessão',
      duplicate: 'Duplicar sessão'
    };

    return titleLabels[this.#data.action];
  }

  get saveButton(): string {
    const saveButtonLabels: Record<Action, string> = {
      create: 'Criar',
      edit: 'Guardar',
      duplicate: 'Duplicar'
    };

    return saveButtonLabels[this.#data.action];
  }

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
    const defaultStartDateTime = this.#getDefaultStartDateTime();
    const { id, client, coach, startDate, endDate, type, location } = this.#data.session;

    this.form = this.#formBuilder.group<SessionUpsertForm>({
      startDate: this.#formBuilder.control<Date>(
        startDate ? new Date(startDate) : defaultStartDateTime,
        Validators.required
      ),
      startTime: this.#formBuilder.control<Date>(
        startDate ? new Date(startDate) : defaultStartDateTime,
        Validators.required
      ),
      duration: this.#formBuilder.control<number>(
        startDate && endDate ? differenceInMinutes(endDate, startDate) : 60,
        Validators.required
      ),
      clientId: this.#formBuilder.control<string>(client?.id ?? '', Validators.required),
      coachId: this.#formBuilder.control<string>(coach?.id ?? '', Validators.required),
      sessionType: this.#formBuilder.control<string>(type ?? '', Validators.required),
      location: this.#formBuilder.control<string>(location ?? '', Validators.required)
    });

    const hasSessionStarted =
      this.#data.action === 'edit' && !!id && !!startDate && isBefore(startDate, new Date());
    if (hasSessionStarted) {
      this.form.disable();
    } else if (!this.#authService.userPermissions().includes(Permission.editSessionsCoach)) {
      this.form.controls.coachId.disable();
    }

    this.form.controls.location.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => this.currentLocation.set(value));

    this.#loadLocations();
  }

  close(): void {
    this.#bottomSheetRef.dismiss();
  }

  confirm(): void {
    const { clientId, coachId, duration, startDate, startTime, sessionType, location } =
      this.form.getRawValue();
    const result: SessionUpsertFormResult = {
      clientId,
      coachId,
      duration,
      startDate,
      startTime,
      sessionType,
      location
    };

    this.#bottomSheetRef.dismiss(result);
  }

  #getDefaultStartDateTime(): Date {
    const now = new Date();
    const rounded = roundToNearestMinutes(now, { nearestTo: 30 });

    return getMinutes(rounded) < getMinutes(now) ? addMinutes(rounded, 30) : rounded;
  }

  #loadLocations(): void {
    const { startDate, endDate } = this.#data.session;
    if (!startDate || !endDate) {
      throw new Error('Invalid start/end date');
    }
    this.#data
      .fetchLocations(startDate, endDate)
      .pipe(take(1))
      .subscribe((locations) => this.#handleLocations(locations));

    merge(
      this.form.controls.startDate.valueChanges,
      this.form.controls.startTime.valueChanges,
      this.form.controls.duration.valueChanges
    )
      .pipe(
        switchMap(() => {
          const {
            startDate: formStartDate,
            startTime: formStartTime,
            duration: formDuration
          } = this.form.getRawValue();
          const start = new Date(formStartDate);
          start.setHours(formStartTime.getHours(), formStartTime.getMinutes(), 0, 0);
          const end = addMinutes(start, formDuration);
          return this.#data.fetchLocations(start.getTime(), end.getTime());
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((locations) => this.#handleLocations(locations));
  }

  #handleLocations(locations: string[]): void {
    const locationsList =
      this.#data.action !== 'create' &&
      this.#data.session.location &&
      !locations.includes(this.#data.session.location)
        ? [...locations, this.#data.session.location]
        : locations;

    this.possibleLocations.set(locationsList);

    const currentLocation = this.form.controls.location.value;
    if (currentLocation && !locationsList.includes(currentLocation)) {
      this.form.controls.location.setValue('');
    }
  }
}
