import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { IS_MOBILE } from '../../../core/tokens/mobile.token';

export interface FormArrayFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select';
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  required?: boolean;
}

@Component({
  selector: 'app-form-array-field',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './form-array-field.component.html',
  styleUrl: './form-array-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormArrayFieldComponent {
  isMobile = inject(IS_MOBILE);

  formArray = input.required<FormArray>();
  fields = input.required<FormArrayFieldConfig[]>();
  addButtonLabel = input<string>('Adicionar');
  removeTooltip = input<string>('Remover');

  addField = output<void>();
  removeField = output<number>();

  onAddField(): void {
    this.addField.emit();
  }

  onRemoveField(index: number): void {
    this.removeField.emit(index);
  }
}
