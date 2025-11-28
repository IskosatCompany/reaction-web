import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-session-report',
  templateUrl: './add-session-report.component.html',
  styleUrl: './add-session-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule]
})
export class AddSessionReportComponent {
  readonly #bottomSheetRef = inject(MatBottomSheetRef);

  report?: string;

  close(): void {
    this.#bottomSheetRef.dismiss();
  }

  confirm(): void {
    this.#bottomSheetRef.dismiss(this.report);
  }
}
