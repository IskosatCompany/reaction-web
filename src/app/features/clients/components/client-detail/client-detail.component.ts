import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Client, ClientForm } from '../../models/client.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientsApiService } from '../../api/clients-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Observable, startWith, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { EvaluationApiService } from '../../api/evaluation-api.service';
import { Evaluation, EvaluationForm } from '../../models/evaluation.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { EvaluationsAccordionComponent } from '../evaluations/evaluations-accordion/evaluations-accordion.component';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EvaluationFormComponent } from '../evaluations/evaluation-form/evaluation-form.component';
import { ClientFormComponent } from '../client-form/client-form.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-detail',
  imports: [
    MatTooltipModule,
    CardComponent,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    EvaluationsAccordionComponent,
    DatePipe
  ],
  providers: [ClientsApiService, EvaluationApiService],
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
  router = inject(Router);
  route = inject(ActivatedRoute);
  isValid = signal(false);
  editClientSubject$ = new Subject<void>();
  addEvaluationSubject$ = new Subject<void>();
  formValue?: Partial<ClientForm>;
  clientId: string = this.route.snapshot.params['id'];
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
}
