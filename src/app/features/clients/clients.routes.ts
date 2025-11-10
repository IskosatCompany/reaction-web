import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/clients-list/clients-list.component').then((m) => m.ClientsListComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./components/client-detail/client-detail.component').then(
        (m) => m.ClientDetailComponent
      )
  }
];
