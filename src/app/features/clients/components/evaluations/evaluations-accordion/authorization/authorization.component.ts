import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Authorization } from '../../../../models/evaluation/authorization.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-authorization',
  imports: [DatePipe],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationComponent {
  authorization = input<Authorization>();
}
