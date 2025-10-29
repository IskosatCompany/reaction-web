import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { RoutesPaths } from '../../../../core/models/routes-paths.enum';
import { PasswordApiService } from '../../api/password-api.service';
import { AuthenticationContainerComponent } from '../container/container.component';

interface ResetPasswordForm {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

@Component({
  selector: 'app-reset-password',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AuthenticationContainerComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #router = inject(Router);
  readonly #passwordApiService = inject(PasswordApiService);
  readonly #snackBar = inject(MatSnackBar);

  readonly showPassword = signal(false);
  readonly passwordInputType = computed(() => (this.showPassword() ? 'text' : 'password'));
  readonly passwordInputIcon = computed(() =>
    this.showPassword() ? 'visibility' : 'visibility_off'
  );

  readonly showConfirmPassword = signal(false);
  readonly confirmPasswordInputType = computed(() =>
    this.showConfirmPassword() ? 'text' : 'password'
  );
  readonly confirmPasswordInputIcon = computed(() =>
    this.showConfirmPassword() ? 'visibility' : 'visibility_off'
  );

  token!: string;
  form!: FormGroup<ResetPasswordForm>;

  constructor() {
    const routeToken = inject(ActivatedRoute).snapshot.queryParamMap.get('token');
    if (!routeToken) {
      // eslint-disable-next-line no-console
      console.error('Token not found');
      this.#router.navigateByUrl(`/${RoutesPaths.login}`);
      return;
    }

    this.token = routeToken;
    this.form = this.#formBuilder.group<ResetPasswordForm>(
      {
        password: this.#formBuilder.control<string>('', [Validators.required]),
        confirmPassword: this.#formBuilder.control<string>('', [Validators.required])
      },
      { validators: this.passwordsValidator }
    );

    this.form.valueChanges.subscribe(() => {
      if (this.form.hasError('passwordsMismatch')) {
        this.form.controls.password.setErrors({ passwordsMismatch: true });
        this.form.controls.confirmPassword.setErrors({ passwordsMismatch: true });
      } else {
        this.form.controls.password.setErrors(null);
        this.form.controls.confirmPassword.setErrors(null);
      }
    });
  }

  passwordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup<ResetPasswordForm>;
    if (!formGroup.controls.password.value || !formGroup.controls.confirmPassword.value) {
      return null;
    }

    if (formGroup.controls.password.value === formGroup.controls.confirmPassword.value) {
      return null;
    }

    return { passwordsMismatch: true };
  };

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((value) => !value);
  }

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password } = this.form.getRawValue();
    this.#passwordApiService
      .resetPassword(this.token, password)
      .pipe(
        catchError(() => {
          this.#snackBar.open('Ocorreu um erro, tente novamente mais tarde');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.#snackBar.open('Senha atualizada com sucesso');
        this.#router.navigateByUrl(`/${RoutesPaths.login}`);
      });
  }
}
