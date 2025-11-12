import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EvaluationFormComponent } from '../evaluation-form/evaluation-form.component';
import { Evaluation } from '../../../models/evaluation/evaluation.model';
import { EvaluationApiService } from '../../../api/evaluation-api.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  onEvaluationCreate(evaluation: Partial<Evaluation>): void {
    this.evaluationApiService.addEvaluation(evaluation).subscribe(() => {
      this.router.navigate(['/clients', this.route.snapshot.params['id']]);
    });
  }
}
