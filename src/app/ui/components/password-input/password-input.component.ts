import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-password-input',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent implements ControlValueAccessor {
  label = input('Senha');
  appearance = input<MatFormFieldAppearance>('outline');

  readonly value = signal('');
  readonly disabled = signal(false);
  readonly showPassword = signal(false);
  readonly passwordInputType = computed(() => (this.showPassword() ? 'text' : 'password'));
  readonly passwordInputIcon = computed(() =>
    this.showPassword() ? 'visibility' : 'visibility_off'
  );

  onChanged!: (value: string) => void;
  onTouched!: () => void;

  writeValue(obj: string): void {
    this.value.set(obj);
  }

  registerOnChange(fn: (value: string) => void) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
}
