import { Routes } from '@angular/router';
import { RoutesPaths } from './core/models/routes-paths.enum';

export const routes: Routes = [
  {
    path: RoutesPaths.login,

    // TODO: change component
    loadComponent: () =>
      import('./features/clients/components/clients-list/clients-list').then((m) => m.ClientsList)
  },
  {
    path: RoutesPaths.logout,

    // TODO: change component
    loadComponent: () =>
      import('./features/clients/components/clients-list/clients-list').then((m) => m.ClientsList)
  },
  {
    path: RoutesPaths.scheduler,
    data: { title: 'Agenda' },

    // TODO: change component
    loadComponent: () =>
      import('./features/clients/components/clients-list/clients-list').then((m) => m.ClientsList)
  },
  {
    path: RoutesPaths.clients,
    data: { title: 'Clientes' },
    loadComponent: () =>
      import('./features/clients/components/clients-list/clients-list').then((m) => m.ClientsList)
  },
  {
    path: RoutesPaths.team,
    data: { title: 'Equipa' },

    // TODO: change component
    loadComponent: () =>
      import('./features/clients/components/clients-list/clients-list').then((m) => m.ClientsList)
  },
  {
    path: RoutesPaths.settings,
    data: { title: 'Perfil' },

    // TODO: change component
    loadComponent: () =>
      import('./features/clients/components/clients-list/clients-list').then((m) => m.ClientsList)
  }
];
