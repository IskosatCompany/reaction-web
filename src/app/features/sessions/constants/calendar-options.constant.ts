import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { differenceInMinutes } from 'date-fns';

export const CALENDAR_DEFAULT_OPTIONS: CalendarOptions = {
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
  selectAllow: (selectInfo) => differenceInMinutes(selectInfo.end, selectInfo.start) <= 30
};
