import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';

@Component({
  selector: 'app-auth-container',
  imports: [MatCardModule],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationContainerComponent {
  readonly isMobile = inject(IS_MOBILE);
}
