import { Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  RouteConfigLoadEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';
import { filter } from 'rxjs';
import { RoutesPaths } from './core/models/routes-paths.enum';
import { IS_MOBILE } from './core/tokens/mobile.token';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  menuItems: MenuItem[] = [
    { label: 'Agenda', route: `/${RoutesPaths.scheduler}`, icon: 'calendar_today' },
    { label: 'Clientes', route: `/${RoutesPaths.clients}`, icon: 'fitness_center' },
    { label: 'Equipa', route: `/${RoutesPaths.team}`, icon: 'groups' },
    { label: 'Perfil', route: `/${RoutesPaths.settings}`, icon: 'person' },
    { label: 'Sair', route: `/${RoutesPaths.logout}`, icon: 'logout' }
  ];

  isMobile = inject(IS_MOBILE);
  isMenuOpen = signal(false);
  pageTitle = signal('');

  readonly #router = inject(Router);

  constructor() {
    effect(() => {
      if (this.isMobile()) {
        this.isMenuOpen.set(false);
      }
    });

    this.#router.events
      .pipe(
        takeUntilDestroyed(),
        filter((item) => item instanceof RouteConfigLoadEnd)
      )
      .subscribe((item) => this.pageTitle.set(item.route.data?.['title'] ?? ''));
  }

  toggleSideMenu(value: boolean): void {
    if (!this.isMobile()) {
      return;
    }

    this.isMenuOpen.set(value);
  }
}
