import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-client-detail',
  imports: [],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientDetailComponent {}
