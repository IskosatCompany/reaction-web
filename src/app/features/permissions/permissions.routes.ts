import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/permissions/permissions.component').then((m) => m.PermissionsComponent)
  }
];
