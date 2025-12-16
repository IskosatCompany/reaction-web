import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  Input,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldAppearance, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@Component({
  selector: 'app-searchable-select',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, NgxMatSelectSearchModule],
  templateUrl: './searchable-select.component.html',
  styles: `
    mat-form-field {
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ]
})
export class SearchableSelectComponent<T> implements ControlValueAccessor {
  @Input() items: T[] = [];
  @Input() valueKey!: keyof T;
  @Input() displayFn!: (item: T) => string;
  @Input() label = '';
  @Input() placeholder = 'Search';
  @Input() allowNull = true;
  @Input() appearance: MatFormFieldAppearance = 'outline';

  readonly searchCtrl = new FormControl<string>('');
  readonly search = toSignal(this.searchCtrl.valueChanges, { initialValue: '' });
  readonly filteredItems = computed(() => {
    const search = this.search()?.toLowerCase();
    if (!search?.trim()) {
      return this.items;
    }

    return this.items.filter((item) => this.displayFn(item).toLowerCase().includes(search));
  });

  value = signal<unknown>(null);
  disabled = signal(false);
  onChange!: (value: unknown) => void;
  onTouched!: () => void;

  writeValue(obj: unknown): void {
    this.value.set(obj);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  select(value: unknown): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
  }
}
