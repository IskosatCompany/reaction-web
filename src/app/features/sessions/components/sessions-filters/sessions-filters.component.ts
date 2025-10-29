import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Client } from '../../../clients/models/client.interface';
import { Coach } from '../../../coaches/models/coach.model';
import { SessionsFilters } from '../../models/sessions-filters.interface';

interface SessionsFiltersForm {
  date: FormControl<Date | undefined>;
  clientId: FormControl<string>;
  coachId: FormControl<string>;
}

@Component({
  selector: 'app-sessions-filters',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './sessions-filters.component.html',
  styleUrl: './sessions-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsFiltersComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);

  clients = input<Client[]>([]);
  coaches = input<Coach[]>([]);
  filtersChanged = output<SessionsFilters>();

  form: FormGroup<SessionsFiltersForm>;

  selectedDate?: number;
  selectedClientId?: string;
  selectedCoachId?: string;

  constructor() {
    this.form = this.#formBuilder.group<SessionsFiltersForm>({
      date: this.#formBuilder.control<Date | undefined>(undefined),
      clientId: this.#formBuilder.control<string>(''),
      coachId: this.#formBuilder.control<string>('')
    });

    // this.form.controls.date.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => );
    // this.form.controls.clientId.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => );
    // this.form.controls.coachId.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => );
  }

  clearFilters(): void {
    this.selectedDate = undefined;
    this.selectedClientId = undefined;
    this.selectedCoachId = undefined;
    this.filtersChanged.emit({});
  }
}
