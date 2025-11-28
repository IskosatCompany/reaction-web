import { inject, Injectable } from '@angular/core';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { differenceInMinutes, endOfDay, startOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import { SessionsApiService } from '../api/sessions-api.service';
import { SessionDto } from '../models/http/session-dto.interface';
import { SessionsRequest } from '../models/http/sessions-request.interface';
import { CalendarFilters } from '../models/calendar-filters.interface';
import { SessionsStore } from '../store/sessions.store';

@Injectable()
export class CalendarService {
  readonly #openFilters = new Subject<void>();
  readonly #viewChanged = new Subject<{ title: string }>();
  readonly #dateClicked = new Subject<Date>();
  readonly #sessionClicked = new Subject<string>();
  readonly #apiService = inject(SessionsApiService);
  readonly #store = inject(SessionsStore);

  #calendarApi?: Calendar;
  #filters: CalendarFilters = {};

  readonly openFilters$ = this.#openFilters.asObservable();
  readonly viewChanged$ = this.#viewChanged.asObservable();
  readonly dateClicked$ = this.#dateClicked.asObservable();
  readonly sessionClicked$ = this.#sessionClicked.asObservable();

  get options(): CalendarOptions {
    return {
      themeSystem: 'bootstrap5',
      locale: 'pt',
      initialView: 'timeGridWeek',
      allDaySlot: false,
      nowIndicator: true,
      slotEventOverlap: false,
      eventMaxStack: 3,
      height: '100%',
      windowResizeDelay: 0,
      headerToolbar: {
        // TODO: Uncomment for filters feature
        // start: 'prev,next filters',
        start: 'prev,next',
        end: 'timeGridDay,timeGridWeek,dayGridMonth'
      },
      buttonText: {
        day: 'Dia',
        week: 'Semana',
        month: 'Mês'
      },
      buttonHints: {
        day: 'Ver por dia',
        week: 'Ver por semana',
        month: 'Ver por mês',
        next: 'Próximo',
        prev: 'Anterior',
        today: 'Hoje'
      },
      // TODO: Uncomment for filters feature
      // customButtons: { filters: { icon: 'funnel', click: () => this.#openFilters.next() } },
      selectable: true,
      plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin, bootstrap5Plugin],
      selectAllow: (selectInfo) => differenceInMinutes(selectInfo.end, selectInfo.start) <= 30,
      dateClick: (arg) => this.#dateClicked.next(arg.date),
      datesSet: (arg) => this.#viewChanged.next({ title: arg.view.title }),
      eventClick: (arg) => this.#sessionClicked.next(arg.event.id),
      events: (fetchInfo, successCallback, failureCallback) => {
        this.#calendarApi?.removeAllEvents();

        const { date, clientId, coachId } = this.#filters;
        const request: SessionsRequest = {
          startDate: date ? startOfDay(date).getTime() : fetchInfo.start.getTime(),
          endDate: date ? endOfDay(date).getTime() : fetchInfo.end.getTime(),
          clientId,
          coachId
        };

        this.#apiService.getSessions(request).subscribe({
          next: (sessions) => {
            const events = sessions.map((item): EventInput => {
              const client = this.#store.getClientById(item.clientId);
              const coach = this.#store.getCoachById(item.coachId);

              return {
                id: item.id,
                title: client.name,
                start: item.startDate,
                end: item.endDate,
                editable: false,
                backgroundColor: coach.color,
                borderColor: coach.color
              };
            });

            successCallback(events);
          },
          error: (err) => failureCallback(err)
        });
      }
    };
  }

  setCalendarApi(calendarApi: Calendar): void {
    this.#calendarApi = calendarApi;
    this.#viewChanged.next({ title: this.#calendarApi.view.title });
  }

  addSession(session: SessionDto): void {
    const client = this.#store.getClientById(session.clientId);
    const coach = this.#store.getCoachById(session.coachId);

    this.#calendarApi?.addEvent({
      id: session.id,
      title: client.name,
      start: session.startDate,
      end: session.endDate,
      editable: false,
      backgroundColor: coach.color,
      borderColor: coach.color
    });
  }

  updateSession(session: SessionDto): void {
    this.removeSession(session.id);
    this.addSession(session);
  }

  removeSession(sessionId: string): void {
    const event = this.#calendarApi?.getEventById(sessionId);
    event?.remove();
  }

  applyFilters(filters: CalendarFilters): void {
    this.#filters = { ...filters };
    if (this.#filters.date) {
      this.#calendarApi?.gotoDate(this.#filters.date);
      return;
    }

    this.#calendarApi?.refetchEvents();
  }

  clearFilters(): void {
    this.#filters = {};
    this.#calendarApi?.refetchEvents();
  }
}
