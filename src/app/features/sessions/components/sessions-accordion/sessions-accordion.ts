import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Session, SessionStatus, SessionStatusLabel } from '../../models/session.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { FormatCoachPipe } from '../../../../ui/pipes/format-coach.pipe';

@Component({
  selector: 'app-sessions-accordion',
  imports: [MatExpansionModule, DatePipe, MatButtonModule, MatIconModule, FormatCoachPipe],
  templateUrl: './sessions-accordion.html',
  styleUrl: './sessions-accordion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsAccordion {
  readonly snackBar = inject(MatSnackBar);
  readonly isMobile = inject(IS_MOBILE);

  session = input.required<Session>();

  isSessionPending = computed(() => this.session().status === SessionStatus.Pending);

  sessionStatusEnum = SessionStatus;
  statusLabels = SessionStatusLabel;

  handlePendingSession(): void {
    if (this.isSessionPending()) {
      this.snackBar.open('Esta sessão está pendente e não pode ser editada.');
    }
  }
}
