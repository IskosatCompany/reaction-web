import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Coach, CoachForm } from '../../models/coach.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CoachBottomSheetData } from '../../models/coach-bottom-sheet-data.model';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-coach-form',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    AsyncPipe
  ],
  templateUrl: './coach-form.component.html',
  styleUrl: './coach-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachFormComponent {
  bottomSheetRef =
    inject<MatBottomSheetRef<CoachBottomSheetData, Partial<CoachForm>>>(MatBottomSheetRef);
  data = inject<CoachBottomSheetData>(MAT_BOTTOM_SHEET_DATA);
  title = this.data.coach ? 'Editar Treinador' : 'Criar Treinador';
  confirmBtnText = this.data.coach ? 'Atualizar' : 'Criar';
  form = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.email]),
    phoneNumber: new FormControl<string | null>(null),
    expertise: new FormControl<string | null>(null, [Validators.required]),
    nif: new FormControl<string | null>(null),
    professionalCardNumber: new FormControl<string | null>(null),
    civilInsurance: new FormControl<string | null>(null),
    workInsurance: new FormControl<string | null>(null),
    address: new FormControl<string | null>(null),
    color: new FormControl<string | null>('#2c5464')
  });

  constructor() {
    effect(() => {
      this.patchForm(this.data.coach);
    });
  }

  patchForm(model?: Coach): void {
    if (!model) {
      return;
    }
    this.form.patchValue({
      name: model.name,
      email: model.email,
      phoneNumber: model.phoneNumber,
      expertise: model.expertise,
      nif: model.nif,
      professionalCardNumber: model.professionalCardNumber,
      civilInsurance: model.civilInsurance,
      workInsurance: model.workInsurance,
      address: model.address,
      color: model.color
    });
  }

  onSubmit(): void {
    this.bottomSheetRef.dismiss(this.form.value);
  }

  onCancel(): void {
    this.bottomSheetRef.dismiss();
  }
}
