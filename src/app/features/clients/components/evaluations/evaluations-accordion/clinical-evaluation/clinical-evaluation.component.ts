import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ClinicalEvaluation } from '../../../../models/evaluation/clinical-evaluation.model';

@Component({
  selector: 'app-clinical-evaluation',
  imports: [],
  templateUrl: './clinical-evaluation.component.html',
  styleUrl: './clinical-evaluation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicalEvaluationComponent {
  clinicalEvaluation = input<ClinicalEvaluation>();
}
