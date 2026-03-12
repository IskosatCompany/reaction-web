import { Routes } from '@angular/router';
import { RoutesPaths } from './core/models/routes-paths.enum';
import { authenticationGuard } from './features/authentication/guards/authentication.guard';
import { loginGuard } from './features/authentication/guards/login.guard';
import {
  coachPageGuard,
  permissionsPageGuard
} from './features/authentication/guards/permissions.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `${RoutesPaths.calendar}`
  },
  {
    path: RoutesPaths.login,
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then((m) => m.loginRoutes)
  },
  {
    path: RoutesPaths.recoverPassword,
    canActivate: [loginGuard],
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then((m) => m.recoverPasswordRoutes)
  },
  {
    path: RoutesPaths.resetPassword,
    canActivate: [loginGuard],
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
    path: RoutesPaths.calendar,
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/sessions/sessions.routes').then((m) => m.calendarRoutes)
  },
  {
    path: RoutesPaths.sessions,
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/sessions/sessions.routes').then((m) => m.sessionsRoutes)
  },
  {
    path: RoutesPaths.clients,
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/clients/clients.routes').then((m) => m.routes)
  },
  {
    path: RoutesPaths.team,
    canActivate: [authenticationGuard, coachPageGuard],
    loadChildren: () => import('./features/coaches/coaches.routes').then((m) => m.routes)
  },
  {
    path: RoutesPaths.profile,
    canActivate: [authenticationGuard],
    loadChildren: () => import('./features/profile/profile.routes').then((m) => m.routes)
  },
  {
    path: RoutesPaths.permissions,
    canActivate: [authenticationGuard, permissionsPageGuard],
    loadChildren: () => import('./features/permissions/permissions.routes').then((m) => m.routes)
  }
];
