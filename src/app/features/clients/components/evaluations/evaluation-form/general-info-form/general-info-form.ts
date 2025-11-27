import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { outputFromObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, filter, map } from 'rxjs';
import { Coach } from '../../../../../coaches/models/coach.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EvaluationGeneralInfoForm } from './general-info-form.model';
import { EvaluationGeneralInfo } from '../../../../models/evaluation/general-info.model';

@Component({
  selector: 'app-general-info-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './general-info-form.html',
  styleUrl: './general-info-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfoFormComponent {
  model = input<EvaluationGeneralInfo>();
  coaches = input<Coach[]>();

  evaluationGeneralInfoForm = new FormGroup({
    coachId: new FormControl<string | null>(null, Validators.required),
    date: new FormControl<Date | null>(null, Validators.required),
    notes: new FormControl<string | null>(null)
  });

  value = outputFromObservable(
    this.evaluationGeneralInfoForm.valueChanges.pipe(
      debounceTime(300),
      filter(() => this.evaluationGeneralInfoForm.valid),
      map(() => this.handleFormData(this.evaluationGeneralInfoForm.getRawValue()))
    )
  );

  isValid = outputFromObservable(
    this.evaluationGeneralInfoForm.statusChanges.pipe(
      map(() => this.evaluationGeneralInfoForm.valid)
    )
  );

  // Coaches
  readonly coachFilterCtrl = new FormControl('');
  readonly coachFilter = toSignal(this.coachFilterCtrl.valueChanges, { initialValue: '' });
  readonly filteredCoaches = computed(() => {
    const search = this.coachFilter()?.toLowerCase();
    if (!search?.trim()) {
      return this.coaches();
    }

    return this.coaches()?.filter(
      (item) =>
        item.name.toLowerCase().includes(search) || item.employeeNumber.toString().includes(search)
    );
  });

  constructor() {
    effect(() => {
      const model = this.model();
      if (model) {
        this.evaluationGeneralInfoForm.setValue({
          coachId: model.coachId ?? null,
          date: model.date ? new Date(model.date) : null,
          notes: model.notes ?? null
        });
      }
    });
  }

  private handleFormData(formData: EvaluationGeneralInfoForm): EvaluationGeneralInfo {
    if (!formData.coachId || !formData.date) {
      throw new Error('Client ID, Coach ID and Date are required fields.');
    }
    return {
      coachId: formData.coachId ?? undefined,
      date: formData.date ? formData.date.getTime() : undefined,
      notes: formData.notes ?? undefined
    };
  }
}
