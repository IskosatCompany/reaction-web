import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ClinicalHistory } from '../../../../models/evaluation/clinical-history.model';

@Component({
  selector: 'app-clinical-history',
  imports: [],
  templateUrl: './clinical-history.component.html',
  styleUrl: './clinical-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicalHistoryComponent {
  clinicalHistory = input<ClinicalHistory>();
}
