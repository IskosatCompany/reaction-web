import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExportPdfRequest } from '../../models/export-pdf-request.interface';

interface ExportPdfForm {
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  withSessions: FormControl<boolean>;
}

@Component({
  selector: 'app-export-report',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './export-report.component.html',
  styleUrl: './export-report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportReportComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #bottomSheetRef =
    inject<MatBottomSheetRef<unknown, Partial<ExportPdfRequest>>>(MatBottomSheetRef);

  readonly form = this.#formBuilder.group<ExportPdfForm>({
    startDate: this.#formBuilder.control<Date | null>(null),
    endDate: this.#formBuilder.control<Date | null>(null),
    withSessions: this.#formBuilder.control<boolean>(true)
  });

  dismiss(): void {
    this.#bottomSheetRef.dismiss();
  }

  export(): void {
    const { startDate, endDate, withSessions } = this.form.getRawValue();
    this.#bottomSheetRef.dismiss({
      startDate: startDate?.getTime(),
      endDate: endDate?.getTime(),
      withSessions
    });
  }
}
