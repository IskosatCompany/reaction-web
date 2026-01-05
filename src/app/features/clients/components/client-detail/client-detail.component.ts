import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { format, subDays } from 'date-fns';
import { saveAs } from 'file-saver';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  startWith,
  Subject,
  switchMap
} from 'rxjs';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { ConfirmActionComponent } from '../../../../ui/components/confirm-action/confirm-action.component';
import { ConfirmAction } from '../../../../ui/components/confirm-action/confirm-action.model';
import { formatClient } from '../../../../ui/helpers/client.helper';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { CoachApiService } from '../../../coaches/api/coach-api.service';
import { SessionsApiService } from '../../../sessions/api/sessions-api.service';
import { SessionsAccordion } from '../../../sessions/components/sessions-accordion/sessions-accordion';
import { Session } from '../../../sessions/models/session.interface';
import { ClientsApiService } from '../../api/clients-api.service';
import { EvaluationApiService } from '../../api/evaluation-api.service';
import { ExportApiService } from '../../api/export-api.service';
import { Client, ClientForm } from '../../models/client.interface';
import { Evaluation } from '../../models/evaluation/evaluation.model';
import { ExportPdfRequest } from '../../models/export-pdf-request.interface';
import { ClientFormComponent } from '../client-form/client-form.component';
import { EvaluationsAccordionComponent } from '../evaluations/evaluations-accordion/evaluations-accordion.component';
import { ExportReportComponent } from '../export-report/export-report.component';
import { ClientPlanningComponent } from './client-planning/client-planning.component';

enum SessionFilter {
  Last30Days = 'Últimos 30 dias',
  Last60Days = 'Últimos 60 dias',
  AllSessions = 'Todas as sessões'
}

interface SessionFilterDate {
  startDate?: Date;
  endDate?: Date;
}

@Component({
  selector: 'app-client-detail',
  imports: [
    MatTooltipModule,
    MatCard,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    MatRadioModule,
    EvaluationsAccordionComponent,
    SessionsAccordion,
    ClientPlanningComponent,
    DatePipe
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientDetailComponent {
  isMobile = inject(IS_MOBILE);
  bottomSheet = inject(MatBottomSheet);
  clientApiService = inject(ClientsApiService);
  evaluationApiService = inject(EvaluationApiService);
  sessionsApiService = inject(SessionsApiService);
  coachesApiService = inject(CoachApiService);
  authService = inject(AuthenticationService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  exportApiService = inject(ExportApiService);

  isValid = signal(false);
  formValue?: Partial<ClientForm>;
  clientId: string = this.route.snapshot.params['id'];
  todayDate = new Date();
  sessionFilterEnum = SessionFilter;
  sessionFilters: Record<SessionFilter, SessionFilterDate> = {
    [SessionFilter.Last30Days]: { startDate: subDays(this.todayDate, 30), endDate: this.todayDate },
    [SessionFilter.Last60Days]: { startDate: subDays(this.todayDate, 60), endDate: this.todayDate },
    [SessionFilter.AllSessions]: { endDate: this.todayDate }
  };
  selectedSessionFilterSubject$ = new BehaviorSubject<SessionFilterDate>(
    this.sessionFilters[SessionFilter.Last30Days]
  );
  editClientSubject$ = new Subject<void>();
  editPlanningSubject$ = new Subject<string>();
  refreshClientSubject$ = new Subject<void>();
  refreshEvaluationsSubject$ = new Subject<void>();

  client = toSignal<Client>(
    this.refreshClientSubject$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.clientApiService
          .getClientDetails(this.clientId)
          .pipe(map((item) => ({ ...item, archived: true })))
      )
    )
  );
  evaluations = toSignal<Evaluation[]>(
    this.refreshEvaluationsSubject$.pipe(
      startWith(undefined),
      switchMap(() => this.evaluationApiService.getEvaluations(this.clientId))
    )
  );

  sessionsDto$ = this.selectedSessionFilterSubject$.pipe(
    switchMap((range) =>
      this.sessionsApiService.getSessions({
        clientId: this.clientId,
        startDate: range.startDate?.getTime(),
        endDate: range.endDate?.getTime()
      })
    )
  );
  coaches$ = this.coachesApiService.getCoaches();

  sessions = toSignal<Session[]>(
    combineLatest([this.sessionsDto$, this.coaches$]).pipe(
      map(([sessionsDto, coaches]) =>
        sessionsDto.map((sessionDto) => {
          const coach = coaches.find((c) => c.id === sessionDto.coachId);
          if (!coach) {
            throw new Error(`Coach with id ${sessionDto.coachId} not found`);
          }
          return {
            id: sessionDto.id,
            client: this.client(),
            coach: coach,
            startDate: sessionDto.startDate,
            endDate: sessionDto.endDate,
            report: sessionDto.report,
            status: sessionDto.status
          } as Session;
        })
      )
    )
  );

  clientName = computed(() =>
    formatClient(this.client()?.name ?? '', this.client()?.clientNumber ?? 0)
  );

  canEdit = this.authService.isAdmin;

  constructor() {
    this.editClientSubject$
      .pipe(
        switchMap(() => this.openEditClientBottomSheet()),
        filter((client?: Partial<ClientForm>) => client !== undefined),
        switchMap((client: Partial<ClientForm>) =>
          this.clientApiService.editClient(this.clientId, client)
        ),
        takeUntilDestroyed()
      )
      .subscribe(() => this.refreshClientSubject$.next());

    this.editPlanningSubject$
      .pipe(
        switchMap((planning: string) =>
          this.clientApiService.editPlanning(this.clientId, planning)
        ),
        takeUntilDestroyed()
      )
      .subscribe(() => this.refreshClientSubject$.next());
  }

  onClientEdit(): void {
    this.editClientSubject$.next();
  }

  onEvaluationAdd(): void {
    this.router.navigate(['/clients', this.clientId, 'evaluation']);
  }

  openEditClientBottomSheet(): Observable<Partial<ClientForm> | undefined> {
    return this.bottomSheet
      .open<ClientFormComponent, Client, Partial<ClientForm>>(ClientFormComponent, {
        data: this.client()
      })
      .afterDismissed();
  }

  onSessionFilterChanged(event: MatRadioChange<SessionFilterDate>): void {
    this.selectedSessionFilterSubject$.next(event.value);
  }

  onPlanningChange(planning: string): void {
    this.editPlanningSubject$.next(planning);
  }

  exportReport(): void {
    this.bottomSheet
      .open<ExportReportComponent, undefined, Omit<ExportPdfRequest, 'clientId'>>(
        ExportReportComponent
      )
      .afterDismissed()
      .pipe(
        filter((item) => !!item),
        switchMap((request) =>
          this.exportApiService.exportPdf({ ...request, clientId: this.clientId }).pipe(
            map((file) => ({
              file,
              startDate: request.startDate,
              endDate: request.endDate
            }))
          )
        )
      )
      .subscribe((response) => {
        let fileName = this.client()?.name ?? `${this.clientId}`;
        if (response.startDate) {
          fileName += `-${format(response.startDate, 'dd-MM-yyyy')}`;
        }

        if (response.endDate) {
          fileName += `-${format(response.endDate, 'dd-MM-yyyy')}`;
        }

        saveAs(response.file, fileName);
      });
  }

  archiveClient(): void {
    this.bottomSheet
      .open<ConfirmActionComponent, ConfirmAction, boolean>(ConfirmActionComponent, {
        data: { message: 'Arquivar cliente?', buttonLabel: 'Arquivar' }
      })
      .afterDismissed()
      .pipe(
        filter((result) => result === true),
        switchMap(() => this.clientApiService.archiveClient(this.clientId))
      )
      .subscribe(() => this.refreshClientSubject$.next());
  }

  unarchiveClient(): void {
    this.bottomSheet
      .open<ConfirmActionComponent, ConfirmAction, boolean>(ConfirmActionComponent, {
        data: { message: 'Desarquivar cliente?', buttonLabel: 'Desarquivar' }
      })
      .afterDismissed()
      .pipe(
        filter((result) => result === true),
        switchMap(() => this.clientApiService.unarchiveClient(this.clientId))
      )
      .subscribe(() => this.refreshClientSubject$.next());
  }
}
