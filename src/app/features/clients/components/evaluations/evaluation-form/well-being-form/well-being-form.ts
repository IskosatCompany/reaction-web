import { ChangeDetectionStrategy, Component } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, map } from 'rxjs';
import { WellBeingForm } from './well-being-form.model';
import { WellBeing } from '../../../../models/evaluation/well-being.model';

@Component({
  selector: 'app-well-being-form',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './well-being-form.html',
  styleUrl: './well-being-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WellBeingFormComponent {
  wellBeingForm = new FormGroup({
    generalState: new FormControl<string | null>(null),
    sleepPattern: new FormControl<string | null>(null),
    sleepHours: new FormControl<number | null>(null),
    dailyPainPattern: new FormControl<string | null>(null)
  });

  value = outputFromObservable(
    this.wellBeingForm.valueChanges.pipe(
      debounceTime(300),
      map(() => this.handleFormData(this.wellBeingForm.getRawValue()))
    )
  );

  private handleFormData(formData: WellBeingForm): WellBeing {
    return {
      generalState: formData.generalState ?? undefined,
      sleepPattern: formData.sleepPattern ?? undefined,
      sleepHours: formData.sleepHours ?? undefined,
      dailyPainPattern: formData.dailyPainPattern ?? undefined
    };
  }
}
