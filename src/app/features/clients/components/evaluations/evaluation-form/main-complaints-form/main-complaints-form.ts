import { ChangeDetectionStrategy, Component } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { debounceTime, map } from 'rxjs';
import { MainComplaintsForm } from './main-complaints-form.model';
import { MainComplaints } from '../../../../models/evaluation/main-complaints.model';
@Component({
  selector: 'app-main-complaints-form',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSliderModule],
  templateUrl: './main-complaints-form.html',
  styleUrl: './main-complaints-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComplaintsFormComponent {
  mainComplaintsForm = new FormGroup({
    mainComplaints: new FormControl<string | null>(null),
    painLevel: new FormControl<number | null>(null),
    painType: new FormControl<string | null>(null),
    painLocation: new FormControl<string | null>(null),
    onsetProgression: new FormControl<string | null>(null),
    reliefConditions: new FormControl<string | null>(null),
    aggravation: new FormControl<string | null>(null),
    associatedManifestations: new FormControl<string | null>(null)
  });

  value = outputFromObservable(
    this.mainComplaintsForm.valueChanges.pipe(
      debounceTime(300),
      map(() => this.handleFormData(this.mainComplaintsForm.getRawValue()))
    )
  );

  private handleFormData(formData: MainComplaintsForm): MainComplaints {
    return {
      mainComplaints: formData.mainComplaints ?? undefined,
      painLevel: formData.painLevel ?? undefined,
      painType: formData.painType ?? undefined,
      painLocation: formData.painLocation ?? undefined,
      onsetProgression: formData.onsetProgression ?? undefined,
      reliefConditions: formData.reliefConditions ?? undefined,
      aggravation: formData.aggravation ?? undefined,
      associatedManifestations: formData.associatedManifestations ?? undefined
    };
  }
}
