import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CoachApiService } from '../../../../coaches/api/coach-api.service';
import { Evaluation, EvaluationForm } from '../../../models/evaluation.interface';

@Component({
  selector: 'app-evaluation-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './evaluation-form.component.html',
  styleUrl: './evaluation-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluationFormComponent {
  bottomSheetRef =
    inject<
      MatBottomSheetRef<{ evaluation?: Evaluation; clientId: string }, Partial<EvaluationForm>>
    >(MatBottomSheetRef);
  data = inject<{ evaluation?: Evaluation; clientId: string }>(MAT_BOTTOM_SHEET_DATA);
  coachApiService = inject(CoachApiService);
  form = new FormGroup({
    title: new FormControl<string | null>(null, [Validators.required]),
    date: new FormControl<Date | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null),
    coachId: new FormControl<string | null>(null, [Validators.required]),
    clientId: new FormControl<string | null>(null, [Validators.required])
  });
  coachFilterCtrl = new FormControl('');

  coaches = toSignal(this.coachApiService.getCoaches(), { initialValue: [] });
  coachFilter = toSignal(this.coachFilterCtrl.valueChanges, { initialValue: '' });
  filteredCoaches = computed(() => {
    const search = this.coachFilter()?.toLowerCase();
    if (!search?.trim()) {
      return this.coaches();
    }

    return this.coaches().filter(
      (item) =>
        item.name.toLowerCase().includes(search) || item.employeeNumber.toString().includes(search)
    );
  });

  constructor() {
    effect(() => {
      this.form.patchValue({
        clientId: this.data.clientId ?? this.data.evaluation?.clientId,
        title: this.data.evaluation?.title ?? null,
        date: this.data.evaluation?.date ?? null,
        description: this.data.evaluation?.description ?? null,
        coachId: this.data.evaluation?.coachId ?? null
      });
    });
  }

  onSubmit(): void {
    this.bottomSheetRef.dismiss(this.form.value);
  }

  onCancel(): void {
    this.bottomSheetRef.dismiss();
  }
}
