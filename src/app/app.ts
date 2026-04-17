import { Component, computed, inject } from '@angular/core';
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
  private readonly authService = inject(AuthenticationService);

  menuItems = computed<SideMenuItem[]>(() => [
    { label: 'Agenda', route: `/${RoutesPaths.calendar}`, icon: 'calendar_month', visible: true },
    { label: 'Clientes', route: `/${RoutesPaths.clients}`, icon: 'group', visible: true },
    {
      label: 'Equipa',
      route: `/${RoutesPaths.team}`,
      icon: 'badge',
      visible: this.authService.userPermissions().includes(Permission.viewCoachSection)
    },
    {
      label: 'Sessões',
      route: `/${RoutesPaths.sessions}`,
      icon: 'fitness_center',
      visible: true
    },
    {
      label: 'Permissões',
      route: `/${RoutesPaths.permissions}`,
      icon: 'manage_accounts',
      visible: this.authService.userPermissions().includes(Permission.managePermissions)
    },
    { label: 'Perfil', route: `/${RoutesPaths.profile}`, icon: 'account_circle', visible: true },
    { label: 'Sair', route: `/${RoutesPaths.logout}`, icon: 'logout', visible: true }
  ]);

  isAuthenticated = inject(AuthenticationService).isAuthenticated;
}
