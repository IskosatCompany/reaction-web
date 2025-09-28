import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/clients-list/clients-list').then((m) => m.ClientsList)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/client-detail/client-detail.component').then(
        (m) => m.ClientDetailComponent
      )
  }
];
