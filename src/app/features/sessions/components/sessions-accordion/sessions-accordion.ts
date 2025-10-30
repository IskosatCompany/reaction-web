import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { SessionDto } from '../../models/http/session-dto.interface';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { UserRole } from '../../../authentication/models/login.interface';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Subject } from 'rxjs';
import { SessionStatus } from '../../models/session.interface';

@Component({
  selector: 'app-sessions-accordion',
  imports: [MatExpansionModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './sessions-accordion.html',
  styleUrl: './sessions-accordion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsAccordion {
  authService = inject(AuthenticationService);

  session = input.required<SessionDto>();

  userRole = signal<UserRole>(this.authService.userRole());
  evaluationEditSubject$ = new Subject<void>();
  canEdit = computed(() => this.userRole() === UserRole.admin);
  statusLabels: Record<SessionStatus, string> = {
    [SessionStatus.Completed]: 'Finalizada',
    [SessionStatus.Pending]: 'Pendente'
  };
}
