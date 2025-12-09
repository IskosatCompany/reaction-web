import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-delete-session-confirmation',
  templateUrl: './delete-session-confirmation.component.html',
  styleUrl: './delete-session-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule]
})
export class DeleteSessionConfirmationComponent {
  readonly #bottomSheetRef = inject(MatBottomSheetRef);

  close(): void {
    this.#bottomSheetRef.dismiss();
  }

  confirm(): void {
    this.#bottomSheetRef.dismiss(true);
  }
}
