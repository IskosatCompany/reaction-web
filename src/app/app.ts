import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoutesPaths } from './core/models/routes-paths.enum';
import { UserRole } from './features/authentication/models/login.interface';
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
    { label: 'Agenda', route: `/${RoutesPaths.sessions}`, icon: 'calendar_today' },
    { label: 'Clientes', route: `/${RoutesPaths.clients}`, icon: 'fitness_center' },
    { label: 'Equipa', route: `/${RoutesPaths.team}`, icon: 'groups', role: UserRole.admin },
    { label: 'Perfil', route: `/${RoutesPaths.profile}`, icon: 'person' },
    { label: 'Sair', route: `/${RoutesPaths.logout}`, icon: 'logout' }
  ];

  isAuthenticated = inject(AuthenticationService).isAuthenticated;
}
