import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DiagnosisAndTreatment } from '../../../../models/evaluation/diagnosis-treatment.model';

@Component({
  selector: 'app-diagnosis-treatment',
  imports: [],
  templateUrl: './diagnosis-treatment.component.html',
  styleUrl: './diagnosis-treatment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagnosisTreatmentComponent {
  diagnosisTreatment = input<DiagnosisAndTreatment>();
}
