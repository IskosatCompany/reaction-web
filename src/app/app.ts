import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoutesPaths } from './core/models/routes-paths.enum';
import { Permission } from './features/authentication/models/permissions.model';
import { AuthenticationService } from './features/authentication/services/authentication.service';
import { SideMenuComponent, SideMenuItem } from './ui/components/side-menu/side-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  menuItems: SideMenuItem[] = [
    { label: 'Agenda', route: `/${RoutesPaths.calendar}`, icon: 'calendar_month' },
    { label: 'Clientes', route: `/${RoutesPaths.clients}`, icon: 'group' },
    {
      label: 'Equipa',
      route: `/${RoutesPaths.team}`,
      icon: 'badge',
      permission: Permission.viewCoachSection
    },
    { label: 'Sessões', route: `/${RoutesPaths.sessions}`, icon: 'fitness_center' },
    {
      label: 'Permissões',
      route: `/${RoutesPaths.permissions}`,
      icon: 'manage_accounts',
      permission: Permission.managePermissions
    },
    { label: 'Perfil', route: `/${RoutesPaths.profile}`, icon: 'account_circle' },
    { label: 'Sair', route: `/${RoutesPaths.logout}`, icon: 'logout' }
  ];

  isAuthenticated = inject(AuthenticationService).isAuthenticated;
}
