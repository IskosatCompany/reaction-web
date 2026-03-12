import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IS_MOBILE } from '../../../core/tokens/mobile.token';
import { Permission } from '../../../features/authentication/models/permissions.model';
import { HasPermissionPipe } from '../../../features/authentication/pipes/has-permission.pipe';
import { AuthenticationService } from '../../../features/authentication/services/authentication.service';

export interface SideMenuItem {
  label: string;
  route: string;
  icon: string;
  permission?: Permission;
}

@Component({
  selector: 'app-side-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    HasPermissionPipe
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideMenuComponent {
  readonly #authService = inject(AuthenticationService);

  menuItems = input.required<SideMenuItem[]>();

  isMobile = inject(IS_MOBILE);
  isMenuOpen = signal(false);
  userId = this.#authService.userId;

  constructor() {
    effect(() => {
      if (this.isMobile()) {
        this.isMenuOpen.set(false);
      }
    });
  }

  toggle(value: boolean): void {
    if (!this.isMobile()) {
      return;
    }

    this.isMenuOpen.set(value);
  }
}
