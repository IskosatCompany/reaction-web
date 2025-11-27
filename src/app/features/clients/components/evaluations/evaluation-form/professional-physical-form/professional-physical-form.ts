import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, map } from 'rxjs/operators';
import { ProfessionalAndPhysicalDataForm } from './professional-physical-form.model';
import { ProfessionalAndPhysicalData } from '../../../../models/evaluation/professional-physical.model';

@Component({
  selector: 'app-professional-physical-form',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './professional-physical-form.html',
  styleUrl: './professional-physical-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfessionalPhysicalForm {
  model = input<ProfessionalAndPhysicalData>();

  professionalPhysicalForm = new FormGroup({
    profession: new FormControl<string | null>(null),
    physicalActivity: new FormControl<string | null>(null),
    regularActivity: new FormControl<string | null>(null),
    height: new FormControl<number | null>(null),
    weight: new FormControl<number | null>(null),
    bmi: new FormControl<number | null>({ value: null, disabled: true })
  });
  value = outputFromObservable(
    this.professionalPhysicalForm.valueChanges.pipe(
      debounceTime(300),
      map(() => this.handleFormData(this.professionalPhysicalForm.getRawValue()))
    )
  );

  constructor() {
    effect(() => {
      const model = this.model();
      if (model) {
        this.professionalPhysicalForm.setValue({
          profession: model.profession ?? null,
          physicalActivity: model.physicalActivity ?? null,
          regularActivity: model.regularActivity ?? null,
          height: model.height ?? null,
          weight: model.weight ?? null,
          bmi: model.bmi ?? null
        });
      }
    });

    this.professionalPhysicalForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const values = this.professionalPhysicalForm.getRawValue();
      const height = values.height;
      const weight = values.weight;
      if (height && weight) {
        const bmi = +(weight / (height * height)).toFixed(2);
        this.professionalPhysicalForm.controls.bmi.setValue(bmi, { emitEvent: false });
      }
    });
  }

  private handleFormData(formData: ProfessionalAndPhysicalDataForm): ProfessionalAndPhysicalData {
    return {
      profession: formData.profession ?? undefined,
      physicalActivity: formData.physicalActivity ?? undefined,
      regularActivity: formData.regularActivity ?? undefined,
      height: formData.height ?? undefined,
      weight: formData.weight ?? undefined,
      bmi: formData.bmi ?? undefined
    };
  }
}
