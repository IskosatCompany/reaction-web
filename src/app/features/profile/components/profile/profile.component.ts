import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { catchError, EMPTY, filter, Observable, startWith, Subject, switchMap } from 'rxjs';
import { PasswordInput } from '../../../../ui/models/password-input.class';
import { PasswordApiService } from '../../../authentication/api/password-api.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CoachApiService } from '../../../coaches/api/coach-api.service';
import { CoachInfoComponent } from '../../../coaches/components/coach-info/coach-info.component';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { Coach, CoachForm } from '../../../coaches/models/coach.model';
import { CoachBottomSheetData } from '../../../coaches/models/coach-bottom-sheet-data.model';
import { CoachFormComponent } from '../../../coaches/components/coach-form/coach-form.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';

interface UpdatePasswordForm {
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  confirmNewPassword: FormControl<string>;
}

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatDivider,
    CoachInfoComponent,
    MatExpansionModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  readonly #formBuilder = inject(NonNullableFormBuilder);
  readonly #apiService = inject(PasswordApiService);
  readonly #matSnackbar = inject(MatSnackBar);
  readonly authService = inject(AuthenticationService);
  readonly coachApiService = inject(CoachApiService);
  readonly bottomSheet = inject(MatBottomSheet);
  readonly snackBarService = inject(MatSnackBar);

  readonly currentPasswordConfig = new PasswordInput();
  readonly newPasswordConfig = new PasswordInput();
  readonly confirmNewPasswordConfig = new PasswordInput();

  readonly refreshSubject$ = new Subject<void>();
  readonly editProfileSubject$ = new Subject<void>();

  readonly userDetails = toSignal<Coach>(
    this.refreshSubject$
      .pipe(startWith(undefined))
      .pipe(switchMap(() => this.coachApiService.getCoachDetails(this.authService.userId())))
  );

  form = this.#formBuilder.group<UpdatePasswordForm>({
    currentPassword: this.#formBuilder.control<string>('', Validators.required),
    newPassword: this.#formBuilder.control<string>('', Validators.required),
    confirmNewPassword: this.#formBuilder.control<string>('', Validators.required)
  });

  constructor() {
    this.editProfileSubject$
      .pipe(
        switchMap(() => this.openEditBottomSheet()),
        filter((coach) => !!coach),
        switchMap((coach) => this.coachApiService.editCoach(this.authService.userId(), coach)),
        takeUntilDestroyed()
      )
      .subscribe((coach: Coach) => {
        if (coach) {
          this.snackBarService.open('Utilizador editado com sucesso', 'Fechar');
          this.refreshSubject$.next();
        } else {
          this.snackBarService.open('Erro ao editar utilizador', 'Fechar');
        }
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();
    this.#apiService
      .updatePassword(currentPassword, newPassword)
      .pipe(
        catchError(() => {
          this.#matSnackbar.open('Ocorreu um erro a atualizar a senha. Tente novamente mais tarde');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.#matSnackbar.open('Senha atualizada com sucesso');
      });
  }

  onProfileEdit(): void {
    this.editProfileSubject$.next();
  }

  openEditBottomSheet(): Observable<Partial<CoachForm> | undefined> {
    return this.bottomSheet
      .open<CoachFormComponent, CoachBottomSheetData, Partial<CoachForm>>(CoachFormComponent, {
        data: {
          coach: this.userDetails(),
          expertiseOptions: this.coachApiService.getExpertises()
        }
      })
      .afterDismissed();
  }
}
