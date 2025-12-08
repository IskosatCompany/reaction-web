import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';

@Component({
  selector: 'app-client-planning',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatButtonModule
  ],
  templateUrl: './client-planning.component.html',
  styleUrl: './client-planning.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientPlanningComponent {
  planning = input<string>();
  planningChanged = output<string>();

  planningForm = new FormGroup({
    planning: new FormControl<string | null>(null)
  });

  isFormValid = toSignal<boolean>(
    this.planningForm.controls.planning.valueChanges.pipe(
      map((planning) => planning !== null && planning.trim().length > 0)
    )
  );

  planningValue = toSignal<string | null>(this.planningForm.controls.planning.valueChanges);

  isSaveBtnEnabled = computed<boolean>(
    () => (this.isFormValid() && this.planningValue() !== this.planning()) ?? false
  );

  constructor() {
    effect(() => {
      const planningValue = this.planning();
      if (planningValue) {
        this.planningForm.patchValue({ planning: planningValue });
      }
    });
  }

  onSave(): void {
    const value = this.planningValue();
    if (this.isFormValid() && value) {
      this.planningChanged.emit(value);
    }
  }
}
