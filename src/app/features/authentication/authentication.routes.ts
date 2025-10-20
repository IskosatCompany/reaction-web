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

export const recoverPasswordRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/recover-password/recover-password.component').then(
        (m) => m.RecoverPasswordComponent
      )
  }
];

export const resetPasswordRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./components/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      )
  }
];
