import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../../authentication/services/authentication.service';
import { EvaluationApiService } from '../../../api/evaluation-api.service';
import { Evaluation } from '../../../models/evaluation/evaluation.model';

@Component({
  selector: 'app-evaluations-accordion',
  imports: [MatExpansionModule, DatePipe, MatButtonModule, MatIconModule],
  providers: [EvaluationApiService],
  templateUrl: './evaluations-accordion.component.html',
  styleUrl: './evaluations-accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluationsAccordionComponent {
  evaluation = input.required<Evaluation>();
  bottomSheet = inject(MatBottomSheet);
  evaluationApiService = inject(EvaluationApiService);
  authService = inject(AuthenticationService);
  evaluationEditSubject$ = new Subject<void>();
  refreshEvaluations = output<void>();

  canEdit = this.authService.isAdmin;

  constructor() {
    // this.evaluationEditSubject$
    //   .pipe(
    //     switchMap(() => this.onEvaluationEditBottomSheet()),
    //     filter((evaluationForm) => !!evaluationForm),
    //     switchMap((evaluationForm) =>
    //       this.evaluationApiService.editEvaluation(this.evaluation()?.id, evaluationForm)
    //     )
    //   )
    //   .subscribe(() => this.refreshEvaluations.emit());
  }

  // onEvaluationEditBottomSheet(): Observable<Partial<EvaluationForm> | undefined> {
  //   return this.bottomSheet
  //     .open(EvaluationFormComponent, {
  //       data: { evaluation: this.evaluation() }
  //     })
  //     .afterDismissed();
  // }

  onEvaluationEdit() {
    this.evaluationEditSubject$.next();
  }
}
