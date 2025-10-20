import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { RoutesPaths } from '../../../../core/models/routes-paths.enum';
import { AuthenticationService } from '../../services/authentication.service';
import { AuthenticationContainerComponent } from '../container/container.component';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AuthenticationContainerComponent,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #snackBar = inject(MatSnackBar);
  readonly #authenticationService = inject(AuthenticationService);
  readonly #router = inject(Router);

  readonly routesPaths = RoutesPaths;
  readonly showPassword = signal(false);
  readonly passwordInputType = computed(() => (this.showPassword() ? 'text' : 'password'));
  readonly passwordInputIcon = computed(() =>
    this.showPassword() ? 'visibility' : 'visibility_off'
  );
  form = this.#formBuilder.group<LoginForm>({
    email: this.#formBuilder.control<string>('', [Validators.required, Validators.email]),
    password: this.#formBuilder.control<string>('', [Validators.required])
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.#authenticationService
      .login(email, password)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // API sends an Unauthorized HTTP error when credentials are invalid
          if (error.status === HttpStatusCode.Unauthorized) {
            this.form.reset();
            this.#snackBar.open('Credenciais de acesso inválidas', undefined, {
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              duration: 1500
            });
          }

          return EMPTY;
        })
      )
      .subscribe(() => this.#router.navigateByUrl(`/${RoutesPaths.sessions}`));
  }
}
