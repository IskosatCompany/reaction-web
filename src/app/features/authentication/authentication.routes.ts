import { Route } from '@angular/router';

export const loginRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent)
  }
];

export const logoutRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/logout/logout.component').then((m) => m.LogoutComponent)
  }
];
