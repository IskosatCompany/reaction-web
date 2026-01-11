import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Coach } from '../../models/coach.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-coach-info',
  imports: [MatIconModule],
  templateUrl: './coach-info.component.html',
  styleUrl: './coach-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachInfoComponent {
  coach = input<Coach>();
}
