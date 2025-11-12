import { ChangeDetectionStrategy, Component } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { AuthorizationForm } from './authorization-form.model';
import { Authorization } from '../../../../models/evaluation/authorization.model';

@Component({
  selector: 'app-authorization-form',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  templateUrl: './authorization-form.html',
  styleUrl: './authorization-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthorizationFormComponent {
  authorizationForm = new FormGroup({
    authorizeEvaluation: new FormControl<boolean | null>(null),
    authorizationDate: new FormControl<Date | null>(null)
  });

  value = outputFromObservable(
    this.authorizationForm.valueChanges.pipe(
      debounceTime(300),
      map(() => this.handleFormData(this.authorizationForm.getRawValue()))
    )
  );

  private handleFormData(formData: AuthorizationForm): Authorization {
    return {
      authorizeEvaluation: formData.authorizeEvaluation ?? undefined,
      date: formData.authorizationDate ? formData.authorizationDate.getTime() : undefined
    };
  }
}
