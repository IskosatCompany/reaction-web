import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY } from 'rxjs';
import { PasswordApiService } from '../../api/password-api.service';
import { AuthenticationContainerComponent } from '../container/container.component';

interface RecoverPasswordForm {
  email: FormControl<string>;
}

@Component({
  selector: 'app-recover-password',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AuthenticationContainerComponent
  ],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecoverPasswordComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #passwordApiService = inject(PasswordApiService);
  readonly #snackBar = inject(MatSnackBar);

  form = this.#formBuilder.group<RecoverPasswordForm>({
    email: this.#formBuilder.control<string>('', [Validators.required, Validators.email])
  });

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.getRawValue();
    this.#passwordApiService
      .recoverPassword(email)
      .pipe(
        catchError(() => {
          this.#snackBar.open('Ocorreu um erro, tente novamente mais tarde');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.#snackBar.open(
          'Foi enviado um email para recuperar a sua senha. Caso não tenha recebido, valide o email introduzido e tente novamente'
        );
      });
  }
}
