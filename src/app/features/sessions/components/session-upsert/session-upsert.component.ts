import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
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
import { UserRole } from '../../../authentication/models/login.interface';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Session } from '../../models/session.interface';
import { UpsertSessionService } from '../../services/upsert-session.service';
import { SessionsStore } from '../../store/sessions.store';

interface SessionUpsertForm {
  startDate: FormControl<Date>;
  startTime: FormControl<Date>;
  duration: FormControl<number>; // 30 minutes or 60 minutes -> default 60 minutes
  clientId: FormControl<string>;
  coachId: FormControl<string>;
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
    MatTooltipModule
  ],
  templateUrl: './session-upsert.component.html',
  styleUrl: './session-upsert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionUpsertComponent {
  readonly #session = inject<Partial<Session>>(MAT_BOTTOM_SHEET_DATA);
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #sessionsStore = inject(SessionsStore);
  readonly #upsertSessionService = inject(UpsertSessionService);
  readonly #authService = inject(AuthenticationService);

  form: FormGroup<SessionUpsertForm>;
  action = signal<Action>(this.#session.id ? 'edit' : 'create');
  title = computed<string>(() => {
    const titleLabels: Record<Action, string> = {
      create: 'Nova Sessão',
      edit: this.#session.client?.name ?? 'Editar Sessão',
      duplicate: 'Duplicar sessão'
    };

    return titleLabels[this.action()];
  });
  saveButton = computed(() => {
    const saveButtonLabels: Record<Action, string> = {
      create: 'Criar',
      edit: 'Guardar',
      duplicate: 'Duplicar'
    };

    return saveButtonLabels[this.action()];
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

  get hasSessionStarted(): boolean {
    const { id, startDate } = this.#session;
    return this.action() === 'edit' && !!id && !!startDate && isBefore(startDate, new Date());
  }

  constructor() {
    const defaultStartDateTime = this.#getDefaultStartDateTime();
    const { client, coach, startDate, endDate } = this.#session;

    this.form = this.#formBuilder.group<SessionUpsertForm>({
      startDate: this.#formBuilder.control<Date>({
        value: startDate ? new Date(startDate) : defaultStartDateTime,
        disabled: this.hasSessionStarted
      }),
      startTime: this.#formBuilder.control<Date>({
        value: startDate ? new Date(startDate) : defaultStartDateTime,
        disabled: this.hasSessionStarted
      }),
      duration: this.#formBuilder.control<number>({
        value: startDate && endDate ? differenceInMinutes(endDate, startDate) : 60,
        disabled: this.hasSessionStarted
      }),
      clientId: this.#formBuilder.control<string>({
        value: client?.id ?? '',
        disabled: this.hasSessionStarted
      }),
      coachId: this.#formBuilder.control<string>({
        value: coach?.id ?? '',
        disabled: this.hasSessionStarted || this.#authService.userRole() === UserRole.coach
      })
    });
  }

  duplicateSession(): void {
    this.action.set('duplicate');

    const defaultStartDateTime = this.#getDefaultStartDateTime();
    this.form.setValue({
      startDate: defaultStartDateTime,
      clientId: this.#session.client?.id ?? '',
      coachId: this.#session.coach?.id ?? '',
      duration: 60,
      startTime: defaultStartDateTime
    });
    this.form.enable();
  }

  close(): void {
    this.#upsertSessionService.closeBottomSheet();
  }

  confirm(): void {
    const { clientId, coachId, duration, startDate, startTime } = this.form.getRawValue();

    const sessionStartDateTime = this.#getSessionStartDateTime(startDate, startTime);

    if (this.action() === 'edit' && this.#session.id) {
      this.#upsertSessionService.editSession(this.#session.id, {
        clientId,
        coachId,
        startDate: sessionStartDateTime.getTime(),
        endDate: addMinutes(sessionStartDateTime, duration).getTime()
      });
    } else {
      this.#upsertSessionService.createSession({
        clientId,
        coachId,
        startDate: sessionStartDateTime.getTime(),
        endDate: addMinutes(sessionStartDateTime, duration).getTime()
      });
    }
  }

  deleteSession(): void {
    if (!this.#session.id) {
      return;
    }

    this.#upsertSessionService.deleteSession(this.#session.id);
  }

  #getSessionStartDateTime(startDate: Date, startTime: Date): Date {
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();

    return new Date(startDate.setHours(hours, minutes, 0, 0));
  }

  #getDefaultStartDateTime(): Date {
    const now = new Date();
    const rounded = roundToNearestMinutes(now, { nearestTo: 30 });

    return getMinutes(rounded) < getMinutes(now) ? addMinutes(rounded, 30) : rounded;
  }
}
