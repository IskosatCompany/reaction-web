import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmAction } from './confirm-action.model';

@Component({
  selector: 'app-confirm-action',
  templateUrl: './confirm-action.component.html',
  styleUrl: './confirm-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule]
})
export class ConfirmActionComponent {
  readonly bottomSheetRef =
    inject<MatBottomSheetRef<ConfirmActionComponent, boolean>>(MatBottomSheetRef);
  readonly data = inject<ConfirmAction>(MAT_BOTTOM_SHEET_DATA);
}
