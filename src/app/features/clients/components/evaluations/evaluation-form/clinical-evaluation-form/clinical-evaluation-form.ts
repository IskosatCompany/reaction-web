import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ClinicalEvaluationForm } from './clinical-evaluation-form.model';
import { ClinicalEvaluation } from '../../../../models/evaluation/clinical-evaluation.model';

@Component({
  selector: 'app-clinical-evaluation-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './clinical-evaluation-form.html',
  styleUrl: './clinical-evaluation-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicalEvaluationFormComponent {
  model = input<ClinicalEvaluation>();
  clinicalEvaluationForm = new FormGroup({
    systems: new FormControl<string | null>(null),
    isometricStrengthTests: new FormArray([this.createIsometricStrengthTestGroup()])
  });

  value = outputFromObservable(
    this.clinicalEvaluationForm.valueChanges.pipe(
      map(() =>
        this.handleFormData(this.clinicalEvaluationForm.getRawValue() as ClinicalEvaluationForm)
      )
    )
  );

  get fieldsArray(): FormArray {
    return this.clinicalEvaluationForm.get('isometricStrengthTests') as FormArray;
  }

  constructor() {
    effect(() => {
      const model = this.model();
      if (model) {
        const groups = model.isometricStrengthTests?.length
          ? model.isometricStrengthTests.map((test) => {
              const group = this.createIsometricStrengthTestGroup();
              group.setValue({
                muscleGroup: test.muscleGroup ?? null,
                left: test.left ?? null,
                right: test.right ?? null,
                rsi: test.rsi ?? null
              });
              return group;
            })
          : [this.createIsometricStrengthTestGroup()];

        this.clinicalEvaluationForm.setControl('isometricStrengthTests', new FormArray(groups));

        this.clinicalEvaluationForm.patchValue({
          systems: model.systems ?? null
        });
      }
    });
  }

  addField(): void {
    this.fieldsArray.push(this.createIsometricStrengthTestGroup());
  }

  removeField(index: number): void {
    if (this.fieldsArray.length > 1) {
      this.fieldsArray.removeAt(index);
    }
  }

  private createIsometricStrengthTestGroup(): FormGroup {
    return new FormGroup({
      muscleGroup: new FormControl<string | null>(null),
      left: new FormControl<number | null>(null),
      right: new FormControl<number | null>(null),
      rsi: new FormControl<number | null>(null)
    });
  }

  private handleFormData(formData: ClinicalEvaluationForm): ClinicalEvaluation {
    return {
      systems: formData.systems ?? undefined,
      isometricStrengthTests:
        formData.isometricStrengthTests
          ?.filter((test) => test.muscleGroup)
          .map((test) => ({
            muscleGroup: test.muscleGroup ?? undefined,
            left: test.left ?? undefined,
            right: test.right ?? undefined,
            rsi: test.rsi ?? undefined
          })) ?? undefined
    };
  }
}
