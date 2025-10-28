import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Client, ClientForm } from '../../models/client.interface';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { parse } from 'date-fns';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-client-form',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientFormComponent {
  bottomSheetRef =
    inject<MatBottomSheetRef<Client | undefined, Partial<ClientForm>>>(MatBottomSheetRef);
  data = inject<Client | undefined>(MAT_BOTTOM_SHEET_DATA);
  title = this.data ? 'Editar Cliente' : 'Criar Cliente';
  confirmBtnText = this.data ? 'Atualizar' : 'Criar';
  form = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    phoneNumber: new FormControl<string | null>(null, [Validators.required]),
    address: new FormControl<string | null>(null),
    birthDate: new FormControl<Date | null>(null),
    nif: new FormControl<string | null>(null)
  });

  constructor() {
    effect(() => {
      this.patchForm(this.data);
    });
  }

  patchForm(model?: Client): void {
    if (!model) {
      return;
    }
    this.form.patchValue({
      name: model.name,
      email: model.email,
      phoneNumber: model.phoneNumber,
      address: model.address,
      birthDate: model.birthDate ? new Date(model.birthDate) : undefined,
      nif: model.nif
    });
  }

  onSubmit(): void {
    this.bottomSheetRef.dismiss(this.form.value);
  }

  onCancel(): void {
    this.bottomSheetRef.dismiss();
  }
}
