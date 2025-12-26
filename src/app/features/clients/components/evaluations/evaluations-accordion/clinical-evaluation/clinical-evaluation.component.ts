import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ClinicalEvaluation } from '../../../../models/evaluation/clinical-evaluation.model';
import { PhysicalTestComponent } from '../physical-tests.component/physical-test.component/physical-test.component';

@Component({
  selector: 'app-clinical-evaluation',
  imports: [PhysicalTestComponent],
  templateUrl: './clinical-evaluation.component.html',
  styleUrl: './clinical-evaluation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicalEvaluationComponent {
  clinicalEvaluation = input<ClinicalEvaluation>();
}
