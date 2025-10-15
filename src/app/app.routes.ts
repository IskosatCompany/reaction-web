import { Routes } from '@angular/router';
import { RoutesPaths } from './core/models/routes-paths.enum';
import { authenticationGuard } from './features/authentication/guards/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RoutesPaths.sessions
  },
  {
    path: RoutesPaths.login,
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then((m) => m.loginRoutes)
  },
  {
    path: RoutesPaths.logout,
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then((m) => m.logoutRoutes)
  },
  {
    path: RoutesPaths.sessions,
    canActivate: [authenticationGuard],
    data: { title: 'Agenda' },

    // TODO: change component
    loadComponent: () =>
      import('./features/clients/components/clients-list/clients-list').then((m) => m.ClientsList)
  },
  {
    path: RoutesPaths.clients,
    canActivate: [authenticationGuard],
    data: { title: 'Clientes' },
    loadChildren: () => import('./features/clients/clients.routes').then((m) => m.routes)
  },
  {
    path: RoutesPaths.team,
    canActivate: [authenticationGuard],
    data: { title: 'Equipa' },

    // TODO: change component
    loadComponent: () =>
      import('./features/clients/components/clients-list/clients-list').then((m) => m.ClientsList)
  },
  {
    path: RoutesPaths.settings,
    canActivate: [authenticationGuard],
    data: { title: 'Perfil' },

    // TODO: change component
    loadComponent: () =>
      import('./features/clients/components/clients-list/clients-list').then((m) => m.ClientsList)
  }
];
