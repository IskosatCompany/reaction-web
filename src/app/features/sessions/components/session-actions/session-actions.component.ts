import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SessionAction } from '../../models/session.interface';

interface Action {
  label: string;
  action: SessionAction;
  icon: string;
  disabled?: boolean;
  tooltip?: string;
}

@Component({
  selector: 'app-session-actions',
  template: `
    <ul>
      @for (item of actions; track $index) {
        <li>
          <button
            [disabled]="item.disabled"
            [matTooltip]="item.tooltip"
            (click)="actionClicked.emit(item.action)"
          >
            <mat-icon>{{ item.icon }}</mat-icon>
            {{ item.label }}
          </button>
        </li>
      }
    </ul>
  `,
  styleUrl: './session-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatTooltipModule]
})
export class SessionActionsComponent {
  actions: Action[] = [];
  actionClicked = output<SessionAction>();
}
