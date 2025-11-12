import { ChangeDetectionStrategy, Component } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, map } from 'rxjs';
import { ClinicalHistoryDataForm } from './clinical-history-form.model';
import { ClinicalHistory } from '../../../../models/evaluation/clinical-history.model';
@Component({
  selector: 'app-clinical-history-form',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './clinical-history-form.html',
  styleUrl: './clinical-history-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicalHistoryForm {
  clinicalHistoryForm = new FormGroup({
    allergies: new FormControl<string | null>(null),
    contraindications: new FormControl<string | null>(null),
    medication: new FormControl<string | null>(null),
    personalHistory: new FormControl<string | null>(null),
    surgicalHistory: new FormControl<string | null>(null),
    hospitalizations: new FormControl<string | null>(null),
    exams: new FormControl<string | null>(null),
    similarInjuries: new FormControl<string | null>(null),
    fractures: new FormControl<string | null>(null),
    accidents: new FormControl<string | null>(null)
  });

  value = outputFromObservable(
    this.clinicalHistoryForm.valueChanges.pipe(
      debounceTime(300),
      map(() => this.handleFormData(this.clinicalHistoryForm.getRawValue()))
    )
  );

  private handleFormData(formData: ClinicalHistoryDataForm): ClinicalHistory {
    return {
      accidents: formData.accidents ?? undefined,
      allergies: formData.allergies ?? undefined,
      contraindications: formData.contraindications ?? undefined,
      medication: formData.medication ?? undefined,
      personalHistory: formData.personalHistory ?? undefined,
      surgicalHistory: formData.surgicalHistory ?? undefined,
      hospitalizations: formData.hospitalizations ?? undefined,
      exams: formData.exams ?? undefined,
      similarInjuries: formData.similarInjuries ?? undefined,
      fractures: formData.fractures ?? undefined
    };
  }
}
