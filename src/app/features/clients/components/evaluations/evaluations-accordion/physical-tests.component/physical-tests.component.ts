import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PhysicalTests } from '../../evaluation-form/physical-tests-form/physical-tests-form.model';
import { PhysicalTestComponent } from './physical-test.component/physical-test.component';

@Component({
  selector: 'app-physical-tests',
  imports: [PhysicalTestComponent],
  templateUrl: './physical-tests.component.html',
  styleUrl: './physical-tests.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhysicalTestsComponent {
  physicalTests = input.required<PhysicalTests>();
}
