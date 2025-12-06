import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../../authentication/services/authentication.service';
import { ClinicalHistoryComponent } from './clinical-history/clinical-history.component';
import { ProfessionalPhysicalComponent } from './professional-physical/professional-physical.component';
import { Evaluation } from '../../../models/evaluation/evaluation.model';
import { EvaluationApiService } from '../../../api/evaluation-api.service';
import { MainComplaintsComponent } from './main-complaints/main-complaints.component';
import { WellBeingComponent } from './well-being/well-being.component';
import { ClinicalEvaluationComponent } from './clinical-evaluation/clinical-evaluation.component';
import { DiagnosisTreatmentComponent } from './diagnosis-treatment/diagnosis-treatment.component';
import { CoachApiService } from '../../../../coaches/api/coach-api.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluations-accordion',
  imports: [
    MatExpansionModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    ClinicalHistoryComponent,
    ProfessionalPhysicalComponent,
    MainComplaintsComponent,
    WellBeingComponent,
    ClinicalEvaluationComponent,
    DiagnosisTreatmentComponent,
    GeneralInfoComponent
  ],
  templateUrl: './evaluations-accordion.component.html',
  styleUrl: './evaluations-accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluationsAccordionComponent {
  router = inject(Router);
  bottomSheet = inject(MatBottomSheet);
  evaluationApiService = inject(EvaluationApiService);
  coachApiService = inject(CoachApiService);
  authService = inject(AuthenticationService);
  evaluationEditSubject$ = new Subject<void>();

  evaluation = input.required<Evaluation>();
  refreshEvaluations = output<void>();

  canEdit = this.authService.isAdmin;

  coaches = toSignal(this.coachApiService.getCoaches());

  generalInfo = computed(() => {
    if (!this.evaluation()) {
      return;
    }

    return {
      coachId: this.evaluation().coachId,
      date: this.evaluation().date,
      notes: this.evaluation().notes
    };
  });

  onEvaluationEdit() {
    this.router.navigate([
      '/clients',
      this.evaluation().clientId,
      'evaluation',
      this.evaluation().id
    ]);
  }
}
