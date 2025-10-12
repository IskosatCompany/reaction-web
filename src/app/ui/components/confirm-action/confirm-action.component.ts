import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ConfirmAction } from './confirm-action.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-action',
  imports: [MatButtonModule],
  templateUrl: './confirm-action.component.html',
  styleUrl: './confirm-action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmActionComponent {
  bottomSheetRef = inject<MatBottomSheetRef<ConfirmActionComponent, boolean>>(MatBottomSheetRef);
  data = inject<ConfirmAction>(MAT_BOTTOM_SHEET_DATA);

  onConfirm() {
    this.data.beforeClose(true);
    this.bottomSheetRef.dismiss(true);
  }

  onCancel() {
    this.data.beforeClose(false);
    this.bottomSheetRef.dismiss(false);
  }
}
