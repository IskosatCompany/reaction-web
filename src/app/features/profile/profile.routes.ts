import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/profile/profile.component').then((m) => m.ProfileComponent)
  }
];
