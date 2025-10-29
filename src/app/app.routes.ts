import { Routes } from '@angular/router';
import { RoutesPaths } from './core/models/routes-paths.enum';
import { authenticationGuard } from './features/authentication/guards/authentication.guard';
import { loginGuard } from './features/authentication/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RoutesPaths.sessions
  },
  {
    path: RoutesPaths.login,
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then((m) => m.loginRoutes)
  },
  {
    path: RoutesPaths.recoverPassword,
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then((m) => m.recoverPasswordRoutes)
  },
  {
    path: RoutesPaths.resetPassword,
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then((m) => m.resetPasswordRoutes)
  },
  {
    path: RoutesPaths.logout,
    canActivate: [authenticationGuard],
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then((m) => m.logoutRoutes)
  },
  {
    path: RoutesPaths.sessions,
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/sessions/sessions.routes').then((m) => m.routes)
  },
  {
    path: RoutesPaths.clients,
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/clients/clients.routes').then((m) => m.routes)
  },
  {
    path: RoutesPaths.team,
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/coaches/coaches.routes').then((m) => m.routes)
  },
  {
    path: RoutesPaths.settings,
    canActivate: [authenticationGuard],

    // TODO: change component
    loadComponent: () =>
      import('./features/clients/components/clients-list/clients-list').then((m) => m.ClientsList)
  }
];
