import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { UserRole } from '../../../authentication/models/login.interface';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Subject } from 'rxjs';
import { Session, SessionStatus } from '../../models/session.interface';

@Component({
  selector: 'app-sessions-accordion',
  imports: [MatExpansionModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './sessions-accordion.html',
  styleUrl: './sessions-accordion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsAccordion {
  authService = inject(AuthenticationService);

  session = input.required<Session>();

  isSessionPending = computed(() => this.session().status === SessionStatus.Pending);

  sessionStatusEnum = SessionStatus;
  evaluationEditSubject$ = new Subject<void>();
  canEdit = computed(
    () =>
      this.authService.userRole() === UserRole.admin ||
      this.authService.userId() === '0c2ed097-e49f-4281-a745-670f175c38a7'
  );
  statusLabels: Record<SessionStatus, string> = {
    [SessionStatus.Completed]: 'Finalizada',
    [SessionStatus.Pending]: 'Pendente'
  };
}
