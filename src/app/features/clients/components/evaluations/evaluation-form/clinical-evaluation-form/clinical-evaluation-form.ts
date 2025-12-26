import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';
import { ClinicalEvaluationForm } from './clinical-evaluation-form.model';
import { ClinicalEvaluation } from '../../../../models/evaluation/clinical-evaluation.model';
import {
  FormArrayFieldComponent,
  FormArrayFieldConfig
} from '../../../../../../ui/components/form-array-field/form-array-field.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-clinical-evaluation-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    FormArrayFieldComponent
  ],
  templateUrl: './clinical-evaluation-form.html',
  styleUrl: './clinical-evaluation-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicalEvaluationFormComponent {
  model = input<ClinicalEvaluation>();

  isometricStrengthTestsFields: FormArrayFieldConfig[] = [
    { name: 'muscleGroup', label: 'Grupo Muscular', type: 'text', placeholder: 'Inserir músculo' },
    { name: 'left', label: 'Esquerda', type: 'number', placeholder: 'Lado Esquerdo' },
    { name: 'right', label: 'Direita', type: 'number', placeholder: 'Lado Direito' },
    { name: 'rsi', label: 'RSI', type: 'number', placeholder: 'RSI' }
  ];

  clinicalEvaluationForm = new FormGroup({
    systems: new FormControl<string | null>(null),
    perimeters: new FormArray([this.createPerimetersTestGroup()])
  });

  value = outputFromObservable(
    this.clinicalEvaluationForm.valueChanges.pipe(
      map(() =>
        this.handleFormData(this.clinicalEvaluationForm.getRawValue() as ClinicalEvaluationForm)
      )
    )
  );

  get fieldsArray(): FormArray {
    return this.clinicalEvaluationForm.get('perimeters') as FormArray;
  }

  constructor() {
    effect(() => {
      const model = this.model();
      if (model) {
        const groups = model.perimeters?.length
          ? model.perimeters.map((test) => {
              const group = this.createPerimetersTestGroup();
              group.setValue({
                muscleGroup: test.muscleGroup ?? null,
                left: test.left ?? null,
                right: test.right ?? null,
                rsi: test.rsi ?? null
              });
              return group;
            })
          : [this.createPerimetersTestGroup()];

        this.clinicalEvaluationForm.setControl('perimeters', new FormArray(groups));

        this.clinicalEvaluationForm.patchValue({
          systems: model.systems ?? null
        });
      }
    });
  }

  addField(): void {
    this.fieldsArray.push(this.createPerimetersTestGroup());
  }

  removeField(index: number): void {
    if (this.fieldsArray.length > 1) {
      this.fieldsArray.removeAt(index);
    }
  }

  private createPerimetersTestGroup(): FormGroup {
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
      perimeters:
        formData.perimeters
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
