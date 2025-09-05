import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsList {}
