import { Route } from '@angular/router';

export const sessionsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/sessions-list/sessions-list.component').then(
        (m) => m.SessionsListComponent
      )
  }
];

export const calendarRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/sessions-calendar/sessions-calendar.component').then(
        (m) => m.SessionsCalendarComponent
      )
  }
];
