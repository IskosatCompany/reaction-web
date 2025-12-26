import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PhysicalTest } from '../../../../../models/evaluation/physical-test.model';

@Component({
  selector: 'app-physical-test',
  imports: [],
  templateUrl: './physical-test.component.html',
  styleUrl: './physical-test.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhysicalTestComponent {
  physicalTest = input<PhysicalTest>();
}
