import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProfessionalAndPhysicalData } from '../../../../models/evaluation/professional-physical.model';

@Component({
  selector: 'app-professional-physical',
  imports: [],
  templateUrl: './professional-physical.component.html',
  styleUrl: './professional-physical.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfessionalPhysicalComponent {
  professionalPhysical = input<ProfessionalAndPhysicalData>();
}
