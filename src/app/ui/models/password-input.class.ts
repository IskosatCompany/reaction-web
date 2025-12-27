import { computed, signal } from '@angular/core';

export class PasswordInput {
  readonly show = signal(false);
  readonly inputType = computed(() => (this.show() ? 'text' : 'password'));
  readonly inputIcon = computed(() => (this.show() ? 'visibility' : 'visibility_off'));

  toggleVisibility(): void {
    this.show.update((value) => !value);
  }
}
