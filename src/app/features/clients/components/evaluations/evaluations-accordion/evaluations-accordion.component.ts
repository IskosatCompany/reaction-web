import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Evaluation, EvaluationForm } from '../../../models/evaluation.interface';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { EvaluationFormComponent } from '../evaluation-form/evaluation-form.component';
import { filter, Observable, Subject, switchMap } from 'rxjs';
import { EvaluationApiService } from '../../../api/evaluation-api.service';

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
  evaluationEditSubject$ = new Subject<void>();
  refreshEvaluations = output<void>();

  constructor() {
    this.evaluationEditSubject$
      .pipe(
        switchMap(() => this.onEvaluationEditBottomSheet()),
        filter((evaluationForm) => !!evaluationForm),
        switchMap((evaluationForm) =>
          this.evaluationApiService.editEvaluation(this.evaluation()?.id, evaluationForm)
        )
      )
      .subscribe(() => this.refreshEvaluations.emit());
  }

  onEvaluationEditBottomSheet(): Observable<Partial<EvaluationForm> | undefined> {
    return this.bottomSheet
      .open(EvaluationFormComponent, {
        data: { evaluation: this.evaluation() }
      })
      .afterDismissed();
  }

  onEvaluationEdit() {
    this.evaluationEditSubject$.next();
  }
}
