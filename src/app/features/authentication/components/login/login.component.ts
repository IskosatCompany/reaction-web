import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { RoutesPaths } from '../../../../core/models/routes-paths.enum';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { AuthenticationService } from '../../services/authentication.service';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #authenticationService = inject(AuthenticationService);
  readonly #router = inject(Router);

  readonly isMobile = inject(IS_MOBILE);

  showPassword = signal(false);
  passwordInputType = computed(() => (this.showPassword() ? 'text' : 'password'));
  passwordInputIcon = computed(() => (this.showPassword() ? 'visibility' : 'visibility_off'));
  form = this.#formBuilder.group<LoginForm>({
    email: this.#formBuilder.control<string>('', [Validators.required, Validators.email]),
    password: this.#formBuilder.control<string>('', [Validators.required])
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.#authenticationService
      .login(email, password)
      .subscribe(() => this.#router.navigateByUrl(`/${RoutesPaths.sessions}`));
  }
}
