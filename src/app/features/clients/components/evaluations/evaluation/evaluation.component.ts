import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { EvaluationFormComponent } from '../evaluation-form/evaluation-form.component';
import { Evaluation } from '../../../models/evaluation/evaluation.model';
import { EvaluationApiService } from '../../../api/evaluation-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-evaluation',
  imports: [EvaluationFormComponent],
  templateUrl: './evaluation.component.html',
  styleUrl: './evaluation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluationComponent {
  evaluationApiService = inject(EvaluationApiService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  evaluationId = this.route.snapshot.params['evaluationId'];

  evaluation = this.evaluationId
    ? toSignal(this.evaluationApiService.getEvaluationById(this.evaluationId))
    : signal(undefined);

  onEvaluationCreate(evaluation: Partial<Evaluation>): void {
    this.evaluationApiService.addEvaluation(evaluation).subscribe(() => {
      this.router.navigate(['/clients', this.route.snapshot.params['id']]);
    });
  }

  onEvaluationEdit(evaluation: Partial<Evaluation>): void {
    if (!this.evaluationId) {
      return;
    }
    this.evaluationApiService.editEvaluation(this.evaluationId, evaluation).subscribe(() => {
      this.router.navigate(['/clients', this.route.snapshot.params['id']]);
    });
  }
}
