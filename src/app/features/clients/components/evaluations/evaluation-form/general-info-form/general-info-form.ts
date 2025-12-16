import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, filter, map } from 'rxjs';
import { SearchableSelectComponent } from '../../../../../../ui/components/searchable-select/searchable-select.component';
import { CoachSelectDirective } from '../../../../../../ui/directives/coach-select.directive';
import { Coach } from '../../../../../coaches/models/coach.model';
import { EvaluationGeneralInfo } from '../../../../models/evaluation/general-info.model';
import { EvaluationGeneralInfoForm } from './general-info-form.model';

@Component({
  selector: 'app-general-info-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    SearchableSelectComponent,
    CoachSelectDirective
  ],
  templateUrl: './general-info-form.html',
  styleUrl: './general-info-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfoFormComponent {
  model = input<EvaluationGeneralInfo>();
  coaches = input<Coach[]>([]);

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
