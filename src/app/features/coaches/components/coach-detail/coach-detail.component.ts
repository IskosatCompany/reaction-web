import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Observable, startWith, Subject, switchMap } from 'rxjs';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { CoachApiService } from '../../api/coach-api.service';
import { CoachBottomSheetData } from '../../models/coach-bottom-sheet-data.model';
import { Coach, CoachForm } from '../../models/coach.model';
import { CoachFormComponent } from '../coach-form/coach-form.component';

@Component({
  selector: 'app-coach-detail',
  imports: [MatButtonModule, CardComponent, MatIconModule],
  templateUrl: './coach-detail.component.html',
  styleUrl: './coach-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.mobile]': 'isMobile()'
  }
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
          this.snackBarService.open('Treinador editado com sucesso', 'Fechar', { duration: 3000 });
          this.refreshCoachSubject$.next();
        } else {
          this.snackBarService.open('Error ao editar treinador', 'Fechar', { duration: 3000 });
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
}
