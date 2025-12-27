import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { PasswordInput } from '../../../../ui/models/password-input.class';
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

  readonly passwordConfig = new PasswordInput();
  readonly confirmPasswordConfig = new PasswordInput();

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
    this.form = this.#formBuilder.group<ResetPasswordForm>({
      password: this.#formBuilder.control<string>('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: this.#formBuilder.control<string>({ value: '', disabled: true }, [
        this.passwordsValidator
      ])
    });

    this.form.controls.password.valueChanges.pipe(takeUntilDestroyed()).subscribe((item) => {
      if (!item.trim()) {
        this.form.controls.confirmPassword.disable();
      } else {
        this.form.controls.confirmPassword.enable();
      }
    });
  }

  passwordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!this.form) {
      return null;
    }

    if (!this.form.controls.password.value || !control.value) {
      return null;
    }

    if (this.form.controls.password.value === control.value) {
      return null;
    }

    return { passwordsMismatch: true };
  };

  submit() {
    if (this.form.invalid) {
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
