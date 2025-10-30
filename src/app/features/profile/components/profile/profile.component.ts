import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY } from 'rxjs';
import { PasswordInputComponent } from '../../../../ui/components/password-input/password-input.component';
import { PasswordApiService } from '../../../authentication/api/password-api.service';

interface UpdatePasswordForm {
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmNewPassword: FormControl<string>;
}

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, PasswordInputComponent, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #apiService = inject(PasswordApiService);
  readonly #matSnackbar = inject(MatSnackBar);

  form = this.#formBuilder.group<UpdatePasswordForm>({
    currentPassword: this.#formBuilder.control<string>('', Validators.required),
    newPassword: this.#formBuilder.control<string>('', Validators.required),
    confirmNewPassword: this.#formBuilder.control<string>('', Validators.required)
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();
    this.#apiService
      .updatePassword(currentPassword, newPassword)
      .pipe(
        catchError(() => {
          this.#matSnackbar.open('Ocorreu um erro a atualizar a senha. Tente novamente mais tarde');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.#matSnackbar.open('Senha atualizada com sucesso');
      });
  }
}
