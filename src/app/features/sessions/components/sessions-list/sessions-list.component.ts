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
import { differenceInMinutes, format, isSameDay } from 'date-fns';
import { EMPTY, map, switchMap } from 'rxjs';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { TableActionsColumn } from '../../../../ui/components/table/models/table-action.interface';
import { ColumnBuilder } from '../../../../ui/components/table/models/table-column.builder';
import { TableColumn } from '../../../../ui/components/table/models/table-column.interface';
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
import {
  Session,
  SessionStatus,
  SessionStatusLabel,
  SessionTypeLabel
} from '../../models/session.interface';
import { SessionsListFiltersService } from '../../services/sessions-list-filters.service';
import { SessionsStore } from '../../store/sessions.store';
import { AddSessionReportComponent } from '../add-session-report/add-session-report.component';
import {
  SessionsListFiltersComponent,
  SessionsListFiltersData
} from '../sessions-list-filters/sessions-list-filters.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './sessions-list.component.html',
  styleUrl: './sessions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SessionsStore, SessionsListFiltersService]
})
export class SessionsListComponent {
  readonly #authService = inject(AuthenticationService);
  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #bottomSheet = inject(MatBottomSheet);
  readonly #sessionsStore = inject(SessionsStore);
  readonly #sessionsApiService = inject(SessionsApiService);
  readonly #filtersService = inject(SessionsListFiltersService);

  readonly sessionStatusLabel = SessionStatusLabel;
  readonly isMobile = inject(IS_MOBILE);
  readonly isLoadingClientsAndCoaches = this.#sessionsStore.isLoadingData;
  readonly isAbleToFilterByCoach = computed(() => this.#authService.userRole() === UserRole.admin);
  readonly tableConfig = this.#getTableConfig();
  readonly sessionsSize$ = this.tableConfig.data$.pipe(map((item) => item.length));

  openFilters(): void {
    this.#bottomSheet.open<SessionsListFiltersComponent, SessionsListFiltersData, SessionsRequest>(
      SessionsListFiltersComponent,
      {
        restoreFocus: false,
        autoFocus: 'dialog',
        viewContainerRef: this.#viewContainerRef
      }
    );
  }

  closeSession(session: Session): void {
    if (
      session.status === SessionStatus.Completed ||
      (!isSameDay(session.startDate, new Date()) && !this.#authService.isAdmin())
    ) {
      return;
    }

    this.#bottomSheet
      .open<AddSessionReportComponent, unknown, string>(AddSessionReportComponent, {
        restoreFocus: false,
        autoFocus: 'dialog',
        viewContainerRef: this.#viewContainerRef
      })
      .afterDismissed()
      .pipe(
        switchMap((report) =>
          report ? this.#sessionsApiService.closeSession(session.id, { report }) : EMPTY
        )
      )
      .subscribe(() => this.#filtersService.reloadSessions());
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
          .cellFn((row) => `${format(row.startDate, 'dd-MM-yyyy HH:mm')}`)
          .build()
      )
      .column(
        new ColumnBuilder<Session>('duration', 'Duração (min)')
          .cellFn((row) => `${differenceInMinutes(row.endDate, row.startDate)}`)
          .build()
      )
      .column(
        new ColumnBuilder<Session>('type', 'Tipo')
          .cellFn((row) => SessionTypeLabel[row.type])
          .build()
      )
      .column(
        new ColumnBuilder<Session>('status', 'Estado')
          .cellFn((row) => SessionStatusLabel[row.status])
          .build()
      )
      .column(this.#getActionsColumn())
      .fromObservable(
        this.#filtersService.loadSessionsSubject.pipe(
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

  #getActionsColumn(): TableColumn<Session> {
    const isAbleToCloseSession = (row: Session) =>
      row.status !== SessionStatus.Completed &&
      (isSameDay(row.startDate, new Date()) || this.#authService.isAdmin());

    const closeSessionAction: TableActionsColumn<Session> = {
      icon: 'assignment_turned_in',
      callback: (row) => this.closeSession(row),
      isDisabled: (row) => !isAbleToCloseSession(row),
      tooltip: () => 'Concluir sessão'
    };

    const warningAction: TableActionsColumn<Session> = {
      icon: 'warning',
      color: '#EBBE4D',
      isHidden: (row) => row.status === SessionStatus.Completed || isAbleToCloseSession(row),
      tooltip: (row) => {
        if (!isSameDay(row.startDate, new Date()) && !this.#authService.isAdmin()) {
          return 'Sem permissões para concluir a sessão';
        }

        return '';
      }
    };

    return new ColumnBuilder<Session>('actions')
      .actions([warningAction, closeSessionAction])
      .build();
  }
}
