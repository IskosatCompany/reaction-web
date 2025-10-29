import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
import {
  addMinutes,
  differenceInMinutes,
  getMinutes,
  isBefore,
  roundToNearestMinutes
} from 'date-fns';
import { UserRole } from '../../../authentication/models/login.interface';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Session } from '../../models/session.interface';
import { UpsertSessionService } from '../../services/upsert-session.service';
import { SessionsStore } from '../../store/sessions.store';

interface SessionUpsertForm {
  startDate: FormControl<Date>;
  startTime: FormControl<Date>;
  duration: FormControl<number>; // 30 minutes or 60 minutes -> default 60 minutes
  description: FormControl<string>;
  clientId: FormControl<string>;
  coachId: FormControl<string>;
}

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
    MatIconModule
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

  readonly sessionDetailsExpanded = signal(false);
  readonly clients = this.#sessionsStore.clients;
  readonly coaches = this.#sessionsStore.coaches;

  get isEditing(): boolean {
    return !!this.#session.id;
  }

  get title(): string {
    return this.#session.client ? this.#session.client?.name : 'Nova sessão';
  }

  get hasSessionStarted(): boolean {
    const { id, startDate } = this.#session;
    return !!id && !!startDate && isBefore(startDate, new Date());
  }

  constructor() {
    const defaultStartDateTime = this.#getDefaultStartDateTime();
    const { client, coach, description, startDate, endDate } = this.#session;

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
      description: this.#formBuilder.control<string>({
        value: description ?? '',
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

  close(): void {
    this.#upsertSessionService.closeBottomSheet();
  }

  confirm(): void {
    const { clientId, coachId, description, duration, startDate, startTime } =
      this.form.getRawValue();

    const sessionStartDateTime = this.#getSessionStartDateTime(startDate, startTime);

    if (this.#session.id) {
      this.#upsertSessionService.editSession(this.#session.id, {
        clientId,
        coachId,
        description,
        startDate: sessionStartDateTime.getTime(),
        endDate: addMinutes(sessionStartDateTime, duration).getTime()
      });
    } else {
      this.#upsertSessionService.createSession({
        clientId,
        coachId,
        description,
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
