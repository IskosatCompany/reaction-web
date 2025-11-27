import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MainComplaints } from '../../../../models/evaluation/main-complaints.model';

@Component({
  selector: 'app-main-complaints',
  imports: [],
  templateUrl: './main-complaints.component.html',
  styleUrl: './main-complaints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComplaintsComponent {
  mainComplaints = input<MainComplaints>();
}
