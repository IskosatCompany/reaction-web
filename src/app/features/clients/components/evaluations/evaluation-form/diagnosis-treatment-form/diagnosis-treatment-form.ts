import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, map } from 'rxjs';
import { DiagnosisAndTreatmentForm } from './diagnosis-treatment-form.model';
import { DiagnosisAndTreatment } from '../../../../models/evaluation/diagnosis-treatment.model';

@Component({
  selector: 'app-diagnosis-treatment-form',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './diagnosis-treatment-form.html',
  styleUrl: './diagnosis-treatment-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagnosisTreatmentFormComponent {
  model = input<DiagnosisAndTreatment>();
  diagnosisTreatmentForm = new FormGroup({
    lesionChain: new FormControl<string | null>(null),
    diagnosis: new FormControl<string | null>(null),
    counseling: new FormControl<string | null>(null)
  });

  value = outputFromObservable(
    this.diagnosisTreatmentForm.valueChanges.pipe(
      debounceTime(300),
      map(() => this.handleFormData(this.diagnosisTreatmentForm.getRawValue()))
    )
  );

  constructor() {
    effect(() => {
      const model = this.model();
      if (model) {
        this.diagnosisTreatmentForm.setValue({
          lesionChain: model.lesionChain ?? null,
          diagnosis: model.diagnosis ?? null,
          counseling: model.counseling ?? null
        });
      }
    });
  }

  private handleFormData(formData: DiagnosisAndTreatmentForm): DiagnosisAndTreatment {
    return {
      lesionChain: formData.lesionChain ?? undefined,
      diagnosis: formData.diagnosis ?? undefined,
      counseling: formData.counseling ?? undefined
    };
  }
}
