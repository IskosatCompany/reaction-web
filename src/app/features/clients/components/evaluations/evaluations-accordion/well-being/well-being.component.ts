import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WellBeing } from '../../../../models/evaluation/well-being.model';

@Component({
  selector: 'app-well-being',
  imports: [],
  templateUrl: './well-being.component.html',
  styleUrl: './well-being.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WellBeingComponent {
  wellBeing = input<WellBeing>();
}
