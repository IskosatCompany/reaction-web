import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { UserRole } from '../../../authentication/models/login.interface';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Session, SessionStatus, SessionStatusLabel } from '../../models/session.interface';

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
  canEdit = this.authService.isAdmin();
  statusLabels = SessionStatusLabel;
}
