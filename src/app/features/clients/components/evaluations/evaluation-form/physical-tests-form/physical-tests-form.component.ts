import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { PhysicalTests, PhysicalTestsForm } from './physical-tests-form.model';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PhysicalTest, PhysicalTestForm } from '../../../../models/evaluation/physical-test.model';
import {
  FormArrayFieldComponent,
  FormArrayFieldConfig
} from '../../../../../../ui/components/form-array-field/form-array-field.component';
import { MatCardModule } from '@angular/material/card';

type TestType = 'isometricStrengthTests' | 'mobilityTests' | 'jumpTests' | 'isoinertialTests';

@Component({
  selector: 'app-physical-tests-form',
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, FormArrayFieldComponent],
  templateUrl: './physical-tests-form.component.html',
  styleUrl: './physical-tests-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhysicalTestsFormComponent {
  model = input<PhysicalTests>();

  physicalTestsForm = new FormGroup({
    isometricStrengthTests: new FormArray([this.createTestGroup()]),
    mobilityTests: new FormArray([this.createTestGroup()]),
    jumpTests: new FormArray([this.createTestGroup()]),
    isoinertialTests: new FormArray([this.createTestGroup()])
  });

  value = outputFromObservable(
    this.physicalTestsForm.valueChanges.pipe(
      map(() => this.handleFormData(this.physicalTestsForm.getRawValue() as PhysicalTestsForm))
    )
  );

  isometricStrengthTestsFields: FormArrayFieldConfig[] = [
    { name: 'muscleGroup', label: 'Grupo Muscular', type: 'text', placeholder: 'Inserir músculo' },
    { name: 'left', label: 'Esquerda', type: 'number', placeholder: 'Lado Esquerdo' },
    { name: 'right', label: 'Direita', type: 'number', placeholder: 'Lado Direito' },
    { name: 'rsi', label: 'RSI', type: 'number', placeholder: 'RSI' }
  ];

  get isometricStrengthTests(): FormArray {
    return this.physicalTestsForm.get('isometricStrengthTests') as FormArray;
  }

  get mobilityTests(): FormArray {
    return this.physicalTestsForm.get('mobilityTests') as FormArray;
  }

  get jumpTests(): FormArray {
    return this.physicalTestsForm.get('jumpTests') as FormArray;
  }

  get isoinertialTests(): FormArray {
    return this.physicalTestsForm.get('isoinertialTests') as FormArray;
  }

  constructor() {
    effect(() => {
      const model = this.model();
      if (model) {
        if (model.isometricStrengthTests) {
          this.createPhysicalTestsArray(model.isometricStrengthTests, 'isometricStrengthTests');
        }
        if (model.mobilityTests) {
          this.createPhysicalTestsArray(model.mobilityTests, 'mobilityTests');
        }
        if (model.jumpTests) {
          this.createPhysicalTestsArray(model.jumpTests, 'jumpTests');
        }
        if (model.isoinertialTests) {
          this.createPhysicalTestsArray(model.isoinertialTests, 'isoinertialTests');
        }
      }
    });
  }

  addField(testType: TestType): void {
    (this.physicalTestsForm.get(testType) as FormArray).push(this.createTestGroup());
  }

  removeField(testType: TestType, index: number): void {
    const formArray = this.physicalTestsForm.get(testType) as FormArray;
    if (formArray.length > 1) {
      formArray.removeAt(index);
    }
  }

  private createTestGroup(): FormGroup {
    return new FormGroup({
      muscleGroup: new FormControl<string | null>(null),
      left: new FormControl<number | null>(null),
      right: new FormControl<number | null>(null),
      rsi: new FormControl<number | null>(null)
    });
  }

  private handleFormData(formValue: PhysicalTestsForm): PhysicalTests {
    return {
      isometricStrengthTests: this.validateTestField(formValue.isometricStrengthTests),
      mobilityTests: this.validateTestField(formValue.mobilityTests),
      jumpTests: this.validateTestField(formValue.jumpTests),
      isoinertialTests: this.validateTestField(formValue.isoinertialTests)
    };
  }

  private validateTestField(tests: PhysicalTestForm[] | null): PhysicalTest[] | undefined {
    const result =
      tests
        ?.filter((test) => test.muscleGroup)
        .map((test) => ({
          muscleGroup: test.muscleGroup ?? undefined,
          left: test.left ?? undefined,
          right: test.right ?? undefined,
          rsi: test.rsi ?? undefined
        })) ?? undefined;

    return result && result.length > 0 ? result : undefined;
  }

  private createPhysicalTestsArray(tests: PhysicalTest[], field: TestType): void {
    const groups = tests?.length
      ? tests.map((test) => {
          const group = this.createTestGroup();
          group.setValue({
            muscleGroup: test.muscleGroup ?? null,
            left: test.left ?? null,
            right: test.right ?? null,
            rsi: test.rsi ?? null
          });
          return group;
        })
      : [this.createTestGroup()];

    this.physicalTestsForm.setControl(field, new FormArray(groups));
  }
}
