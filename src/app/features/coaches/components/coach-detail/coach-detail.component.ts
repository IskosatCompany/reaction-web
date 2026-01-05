import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Observable, startWith, Subject, switchMap } from 'rxjs';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { ConfirmActionComponent } from '../../../../ui/components/confirm-action/confirm-action.component';
import { ConfirmAction } from '../../../../ui/components/confirm-action/confirm-action.model';
import { formatCoach } from '../../../../ui/helpers/coach.helper';
import { CoachApiService } from '../../api/coach-api.service';
import { CoachBottomSheetData } from '../../models/coach-bottom-sheet-data.model';
import { Coach, CoachForm } from '../../models/coach.model';
import { CoachFormComponent } from '../coach-form/coach-form.component';
import { CoachInfoComponent } from '../coach-info/coach-info.component';

@Component({
  selector: 'app-coach-detail',
  imports: [
    MatButtonModule,
    MatCard,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    CoachInfoComponent
  ],
  templateUrl: './coach-detail.component.html',
  styleUrl: './coach-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.mobile]': 'isMobile()' }
})
export class CoachDetailComponent {
  isMobile = inject(IS_MOBILE);
  bottomSheet = inject(MatBottomSheet);
  coachApiService = inject(CoachApiService);
  snackBarService = inject(MatSnackBar);
  router = inject(Router);
  route = inject(ActivatedRoute);

  isValid = signal(false);
  coachId: string = this.route.snapshot.params['id'];
  editCoachSubject$ = new Subject<void>();
  formValue?: Partial<CoachForm>;
  refreshCoachSubject$ = new Subject<void>();

  coach = toSignal<Coach>(
    this.refreshCoachSubject$.pipe(
      startWith(undefined),
      switchMap(() => this.coachApiService.getCoachDetails(this.coachId))
    )
  );

  coachName = computed(() =>
    formatCoach(this.coach()?.name ?? '', this.coach()?.employeeNumber ?? 0)
  );

  constructor() {
    this.editCoachSubject$
      .pipe(
        switchMap(() => this.openEditBottomSheet()),
        filter((coach) => !!coach),
        switchMap((coach) => this.coachApiService.editCoach(this.coachId, coach)),
        takeUntilDestroyed()
      )
      .subscribe((coach: Coach) => {
        if (coach) {
          this.snackBarService.open('Treinador editado com sucesso', 'Fechar');
          this.refreshCoachSubject$.next();
        } else {
          this.snackBarService.open('Error ao editar treinador', 'Fechar');
        }
      });
  }

  onCoachEdit(): void {
    this.editCoachSubject$.next();
  }

  openEditBottomSheet(): Observable<Partial<CoachForm> | undefined> {
    return this.bottomSheet
      .open<CoachFormComponent, CoachBottomSheetData, Partial<CoachForm>>(CoachFormComponent, {
        data: {
          coach: this.coach(),
          expertiseOptions: this.coachApiService.getExpertises()
        }
      })
      .afterDismissed();
  }

  archiveCoach(): void {
    this.bottomSheet
      .open<ConfirmActionComponent, ConfirmAction, boolean>(ConfirmActionComponent, {
        data: { message: 'Arquivar treinador?', buttonLabel: 'Arquivar' }
      })
      .afterDismissed()
      .pipe(
        filter((result) => result === true),
        switchMap(() => this.coachApiService.archiveCoach(this.coachId))
      )
      .subscribe(() => this.refreshCoachSubject$.next());
  }

  unarchiveCoach(): void {
    this.bottomSheet
      .open<ConfirmActionComponent, ConfirmAction, boolean>(ConfirmActionComponent, {
        data: { message: 'Desarquivar treinador?', buttonLabel: 'Desarquivar' }
      })
      .afterDismissed()
      .pipe(
        filter((result) => result === true),
        switchMap(() => this.coachApiService.unarchiveCoach(this.coachId))
      )
      .subscribe(() => this.refreshCoachSubject$.next());
  }
}
