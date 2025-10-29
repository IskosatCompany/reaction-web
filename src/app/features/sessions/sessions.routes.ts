import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/sessions-calendar/sessions-calendar.component').then(
        (m) => m.SessionsCalendarComponent
      )
  }
];
