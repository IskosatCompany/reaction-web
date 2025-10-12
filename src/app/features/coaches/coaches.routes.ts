import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/coach-list/coach-list.component').then((m) => m.CoachListComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/coach-detail/coach-detail.component').then((m) => m.CoachDetailComponent)
  }
];
