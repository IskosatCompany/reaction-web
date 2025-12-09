import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, EventInput, EventMountArg } from '@fullcalendar/core';
import { EMPTY, switchMap, tap } from 'rxjs';
import { RoutesPaths } from '../../../../core/models/routes-paths.enum';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { formatClient } from '../../../../ui/helpers/client.helper';
import { UserRole } from '../../../authentication/models/login.interface';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { SessionsApiService } from '../../api/sessions-api.service';
import { CALENDAR_DEFAULT_OPTIONS } from '../../constants/calendar-options.constant';
import { SessionDto } from '../../models/http/session-dto.interface';
import { SessionOverlayService } from '../../services/session-overlay.service';
import { AddSessionService } from '../../services/sessions-actions/add-session.service';
import { CloseSessionService } from '../../services/sessions-actions/close-session.service';
import { DeleteSessionService } from '../../services/sessions-actions/delete-session.service';
import { DuplicateSessionService } from '../../services/sessions-actions/duplicate-session.service';
import { EditSessionService } from '../../services/sessions-actions/edit-session.service';
import { SessionsStore } from '../../store/sessions.store';

@Component({
  selector: 'app-sessions-calendar',
  imports: [
    FullCalendarModule,
    MatSidenavModule,
    MatBottomSheetModule,
    MatFabButton,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  providers: [
    SessionsStore,
    SessionOverlayService,
    AddSessionService,
    EditSessionService,
    DuplicateSessionService,
    DeleteSessionService,
    CloseSessionService
  ],
  templateUrl: './sessions-calendar.component.html',
  styleUrl: './sessions-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsCalendarComponent {
  readonly #sessionsStore = inject(SessionsStore);
  readonly #sessionsApi = inject(SessionsApiService);
  readonly #authService = inject(AuthenticationService);
  readonly #overlayService = inject(SessionOverlayService);
  readonly #addSessionService = inject(AddSessionService);
  readonly #editSessionService = inject(EditSessionService);
  readonly #duplicateSessionService = inject(DuplicateSessionService);
  readonly #deleteSessionService = inject(DeleteSessionService);
  readonly #closeSessionService = inject(CloseSessionService);
  readonly #router = inject(Router);

  #calendarApi?: Calendar;

  readonly calendarComponent = viewChild<FullCalendarComponent>('calendar');
  readonly isMobile = inject(IS_MOBILE);
  readonly calendarTitle = signal('');
  readonly calendarOptions = this.#getCalendarOptions();
  readonly clients = this.#sessionsStore.clients;
  readonly coaches = this.#sessionsStore.coaches;
  readonly isLoadingCalendarData = this.#sessionsStore.isLoadingData;

  constructor() {
    effect(() => {
      const calendarComponent = this.calendarComponent();
      if (!calendarComponent) {
        return;
      }

      const calendarApi = calendarComponent.getApi();
      this.#calendarApi = calendarApi;
    });

    this.#overlayService.performAction$
      .pipe(
        takeUntilDestroyed(),
        switchMap(({ sessionDto, action }) => {
          switch (action) {
            case 'goToClient':
              this.#router.navigate([RoutesPaths.clients, sessionDto.clientId]);
              return EMPTY;

            case 'duplicate':
              return this.#duplicateSessionService
                .duplicate(sessionDto.id)
                .pipe(tap((result) => this.#addSessionToCalendar(result)));

            case 'delete':
              return this.#deleteSessionService
                .delete(sessionDto.id)
                .pipe(tap(() => this.#removeSessionFromCalendar(sessionDto.id)));

            case 'close':
              return this.#closeSessionService
                .close(sessionDto.id)
                .pipe(tap((result) => this.#completeSessionOnCalendar(result)));
          }
        })
      )
      .subscribe();
  }

  createSession(date?: Date): void {
    const coach =
      this.#authService.userRole() === UserRole.coach
        ? this.#sessionsStore.getCoachById(this.#authService.userId())
        : undefined;

    this.#addSessionService
      .add({ startDate: date?.getTime(), coach })
      .subscribe((sessionDto) => this.#addSessionToCalendar(sessionDto));
  }

  editSession(sessionId: string): void {
    this.#editSessionService.edit(sessionId).subscribe((sessionDto) => {
      this.#removeSessionFromCalendar(sessionDto.id);
      this.#addSessionToCalendar(sessionDto);
    });
  }

  #getCalendarOptions(): CalendarOptions {
    return {
      ...CALENDAR_DEFAULT_OPTIONS,
      dateClick: (arg) => this.createSession(arg.date),
      datesSet: (arg) => this.calendarTitle.set(arg.view.title),
      eventClick: (arg) => this.editSession(arg.event.id),
      eventDidMount: (mountArg) => {
        this.#addRightClickListener(mountArg);
        this.#addLongPressListener(mountArg);
      },
      events: (fetchInfo, successCallback, failureCallback) => {
        this.#calendarApi?.removeAllEvents();

        this.#sessionsApi
          .getSessions({
            startDate: fetchInfo.start.getTime(),
            endDate: fetchInfo.end.getTime()
          })
          .subscribe({
            next: (sessions) => {
              const events = sessions.map((item): EventInput => {
                const client = this.#sessionsStore.getClientById(item.clientId);
                const coach = this.#sessionsStore.getCoachById(item.coachId);

                return {
                  id: item.id,
                  title: formatClient(client.name, client.clientNumber),
                  start: item.startDate,
                  end: item.endDate,
                  editable: false,
                  backgroundColor: coach.color,
                  borderColor: coach.color,
                  extendedProps: { sessionDto: item }
                };
              });

              successCallback(events);
            },
            error: (err) => failureCallback(err)
          });
      }
    };
  }

  #addRightClickListener(mountArg: EventMountArg): void {
    mountArg.el.addEventListener('contextmenu', (event) => {
      event.preventDefault();

      const session = this.#calendarApi?.getEventById(mountArg.event.id);
      this.#overlayService.open(mountArg.el, session?.extendedProps['sessionDto']);
    });
  }

  #addLongPressListener(mountArg: EventMountArg): void {
    let pressTimer: number;

    mountArg.el.addEventListener('touchstart', () => {
      pressTimer = setTimeout(() => {
        const session = this.#calendarApi?.getEventById(mountArg.event.id);
        this.#overlayService.open(mountArg.el, session?.extendedProps['sessionDto']);
      }, 600);
    });

    ['touchend', 'touchcancel', 'touchmove'].forEach((evt) =>
      mountArg.el.addEventListener(evt, () => clearTimeout(pressTimer))
    );
  }

  #addSessionToCalendar(sessionDto: SessionDto): void {
    const client = this.#sessionsStore.getClientById(sessionDto.clientId);
    const coach = this.#sessionsStore.getCoachById(sessionDto.coachId);

    this.#calendarApi?.addEvent({
      id: sessionDto.id,
      title: client.name,
      start: sessionDto.startDate,
      end: sessionDto.endDate,
      editable: false,
      backgroundColor: coach.color,
      borderColor: coach.color,
      extendedProps: { sessionDto }
    });
  }

  #removeSessionFromCalendar(sessionId: string): void {
    const event = this.#calendarApi?.getEventById(sessionId);
    event?.remove();
  }

  #completeSessionOnCalendar(sessionDto: SessionDto): void {
    const event = this.#calendarApi?.getEventById(sessionDto.id);
    event?.setExtendedProp('sessionDto', sessionDto);
  }
}
