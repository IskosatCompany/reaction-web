import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewContainerRef
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { differenceInMinutes, format, subDays } from 'date-fns';
import { BehaviorSubject, EMPTY, filter, map, switchMap } from 'rxjs';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { ColumnBuilder } from '../../../../ui/components/table/models/table-column.builder';
import { TableConfig } from '../../../../ui/components/table/models/table-config.interface';
import { TableBuilder } from '../../../../ui/components/table/models/table.builder';
import { TableComponent } from '../../../../ui/components/table/table.component';
import { formatClient } from '../../../../ui/helpers/client.helper';
import { formatCoach } from '../../../../ui/helpers/coach.helper';
import { FormatClientPipe } from '../../../../ui/pipes/format-client.pipe';
import { FormatCoachPipe } from '../../../../ui/pipes/format-coach.pipe';
import { UserRole } from '../../../authentication/models/login.interface';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { SessionsApiService } from '../../api/sessions-api.service';
import { SessionsRequest } from '../../models/http/sessions-request.interface';
import { Session, SessionStatus, SessionStatusLabel } from '../../models/session.interface';
import { SessionsStore } from '../../store/sessions.store';
import { AddSessionReportComponent } from '../add-session-report/add-session-report.component';
import {
  SessionsListFiltersComponent,
  SessionsListFiltersData
} from '../sessions-list-filters/sessions-list-filters.component';

@Component({
  selector: 'app-sessions-list',
  imports: [
    AsyncPipe,
    DatePipe,
    FormatClientPipe,
    FormatCoachPipe,
    ReactiveFormsModule,
    TableComponent,
    SessionsListFiltersComponent,
    CardComponent,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './sessions-list.component.html',
  styleUrl: './sessions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SessionsStore]
})
export class SessionsListComponent {
  readonly #authService = inject(AuthenticationService);
  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #bottomSheet = inject(MatBottomSheet);
  readonly #sessionsStore = inject(SessionsStore);
  readonly #sessionsApiService = inject(SessionsApiService);

  readonly sessionStatusLabel = SessionStatusLabel;
  readonly defaultRequest = this.#getDefaultRequest();
  readonly isMobile = inject(IS_MOBILE);
  readonly isLoadingClientsAndCoaches = this.#sessionsStore.isLoadingData;
  readonly isAbleToFilterByCoach = computed(() => this.#authService.userRole() === UserRole.admin);
  readonly loadSessionsSubject = new BehaviorSubject<SessionsRequest>(this.defaultRequest);
  readonly tableConfig = this.#getTableConfig();

  request = { ...this.defaultRequest };

  openFilters(): void {
    this.#bottomSheet
      .open<SessionsListFiltersComponent, SessionsListFiltersData, SessionsRequest>(
        SessionsListFiltersComponent,
        {
          data: {
            defaultRequest: this.defaultRequest,
            isAbleToFilterByCoach: this.isAbleToFilterByCoach()
          },
          restoreFocus: false,
          autoFocus: 'dialog',
          viewContainerRef: this.#viewContainerRef
        }
      )
      .afterDismissed()
      .pipe(filter((request) => !!request))
      .subscribe((request) => this.handleFiltersChanged(request));
  }

  handleFiltersChanged(request: SessionsRequest): void {
    this.request = { ...request };
    this.loadSessionsSubject.next(this.request);
  }

  completeSession(sessionId: string): void {
    this.#bottomSheet
      .open<AddSessionReportComponent, unknown, string>(AddSessionReportComponent, {
        restoreFocus: false,
        autoFocus: 'dialog',
        viewContainerRef: this.#viewContainerRef
      })
      .afterDismissed()
      .pipe(
        switchMap((report) =>
          report ? this.#sessionsApiService.closeSession(sessionId, { report }) : EMPTY
        )
      )
      .subscribe(() => this.loadSessionsSubject.next(this.request));
  }

  #getDefaultRequest(): SessionsRequest {
    const defaultRequest: SessionsRequest = {
      startDate: subDays(new Date(), 7).getTime(),
      endDate: new Date().getTime()
    };

    if (this.#authService.userRole() === UserRole.coach) {
      defaultRequest.status = SessionStatus.Pending;
    }

    return defaultRequest;
  }

  #getTableConfig(): TableConfig<Session> {
    return new TableBuilder<Session>()
      .column(
        new ColumnBuilder<Session>('client', 'Cliente')
          .cellFn((row) => formatClient(row.client.name, row.client.clientNumber))
          .build()
      )
      .column(
        new ColumnBuilder<Session>('coach', 'Treinador')
          .cellFn((row) => formatCoach(row.coach.name, row.coach.employeeNumber))
          .build()
      )
      .column(
        new ColumnBuilder<Session>('date', 'Data de início')
          .cellFn((row) => `${format(row.startDate, 'dd-MM-yyyy hh:mm')}`)
          .build()
      )
      .column(
        new ColumnBuilder<Session>('duration', 'Duração')
          .cellFn((row) => `${differenceInMinutes(row.endDate, row.startDate)} minutos`)
          .build()
      )
      .column(
        new ColumnBuilder<Session>('status', 'Estado')
          .cellFn((row) => SessionStatusLabel[row.status])
          .build()
      )
      .column(
        new ColumnBuilder<Session>('actions')
          .actions([
            {
              icon: 'assignment_turned_in',
              callback: (row) => this.completeSession(row.id),
              isDisabled: (row) => row.status === SessionStatus.Completed,
              tooltip: 'Completar sessão'
            }
          ])
          .build()
      )
      .fromObservable(
        this.loadSessionsSubject.pipe(
          switchMap((filters) => this.#sessionsApiService.getSessions(filters)),
          map((sessions) =>
            sessions.map(
              (session): Session => ({
                ...session,
                client: this.#sessionsStore.getClientById(session.clientId),
                coach: this.#sessionsStore.getCoachById(session.coachId)
              })
            )
          )
        )
      )
      .build();
  }
}
