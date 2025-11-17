import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { combineLatest, filter, map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { UserRole } from '../../../authentication/models/login.interface';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { CoachApiService } from '../../../coaches/api/coach-api.service';
import { SessionsApiService } from '../../../sessions/api/sessions-api.service';
import { SessionsAccordion } from '../../../sessions/components/sessions-accordion/sessions-accordion';
import { Session } from '../../../sessions/models/session.interface';
import { ClientsApiService } from '../../api/clients-api.service';
import { EvaluationApiService } from '../../api/evaluation-api.service';
import { ExportApiService } from '../../api/export-api.service';
import { Client, ClientForm } from '../../models/client.interface';
import { Evaluation, EvaluationForm } from '../../models/evaluation.interface';
import { ExportPdfRequest } from '../../models/export-pdf-request.interface';
import { ClientFormComponent } from '../client-form/client-form.component';
import { EvaluationFormComponent } from '../evaluations/evaluation-form/evaluation-form.component';
import { EvaluationsAccordionComponent } from '../evaluations/evaluations-accordion/evaluations-accordion.component';
import { ExportReportComponent } from '../export-report/export-report.component';

@Component({
  selector: 'app-client-detail',
  imports: [
    MatTooltipModule,
    CardComponent,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatTabsModule,
    EvaluationsAccordionComponent,
    SessionsAccordion,
    DatePipe
  ],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientDetailComponent {
  isMobile = inject(IS_MOBILE);
  bottomSheet = inject(MatBottomSheet);
  snackBarService = inject(MatSnackBar);
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
  editClientSubject$ = new Subject<void>();
  addEvaluationSubject$ = new Subject<void>();
  refreshClientSubject$ = new Subject<void>();
  refreshEvaluationsSubject$ = new Subject<void>();

  client = toSignal<Client>(
    this.refreshClientSubject$.pipe(
      startWith(undefined),
      switchMap(() => this.clientApiService.getClientDetails(this.clientId))
    )
  );
  evaluations = toSignal<Evaluation[]>(
    this.refreshEvaluationsSubject$.pipe(
      startWith(undefined),
      switchMap(() => this.evaluationApiService.getEvaluations(this.clientId))
    )
  );

  sessionsDto$ = this.sessionsApiService.getSessions({
    clientId: this.clientId
  });

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

  canEdit = computed(
    () =>
      this.authService.userRole() === UserRole.admin ||
      this.authService.userId() === '0c2ed097-e49f-4281-a745-670f175c38a7'
  );

  constructor() {
    this.addEvaluationSubject$
      .pipe(
        switchMap(() => this.openEvaluationBottomSheet()),
        filter((evaluation) => !!evaluation),
        switchMap((evaluation) => this.evaluationApiService.addEvaluation(evaluation))
      )
      .subscribe(() => this.refreshEvaluationsSubject$.next());

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
  }

  onClientEdit(): void {
    this.editClientSubject$.next();
  }

  onEvaluationAdd(): void {
    this.addEvaluationSubject$.next();
  }

  openEditClientBottomSheet(): Observable<Partial<ClientForm> | undefined> {
    return this.bottomSheet
      .open<ClientFormComponent, Client, Partial<ClientForm>>(ClientFormComponent, {
        data: this.client()
      })
      .afterDismissed();
  }

  openEvaluationBottomSheet(): Observable<Partial<EvaluationForm> | undefined> {
    return this.bottomSheet
      .open<
        EvaluationFormComponent,
        { clientId: string; evaluation?: Evaluation },
        Partial<EvaluationForm>
      >(EvaluationFormComponent, {
        data: { clientId: this.clientId }
      })
      .afterDismissed();
  }

  exportReport(): void {
    this.bottomSheet
      .open<ExportReportComponent, undefined, Partial<ExportPdfRequest>>(ExportReportComponent)
      .afterDismissed()
      .pipe(
        filter((item) => !!item),
        switchMap((request) =>
          this.exportApiService
            .exportPdf({
              ...request,
              clientId: this.clientId,
              withSessions: request.withSessions as boolean
            })
            .pipe(
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
}
