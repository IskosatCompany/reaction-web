import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CoachApiService } from '../../../../coaches/api/coach-api.service';
import { ProfessionalPhysicalForm } from './professional-physical-form/professional-physical-form';
import { ClinicalHistoryForm } from './clinical-history-form/clinical-history-form';
import { MainComplaintsFormComponent } from './main-complaints-form/main-complaints-form';
import { WellBeingFormComponent } from './well-being-form/well-being-form';
import { DiagnosisTreatmentFormComponent } from './diagnosis-treatment-form/diagnosis-treatment-form';
import { AuthorizationFormComponent } from './authorization-form/authorization-form';
import { ActivatedRoute } from '@angular/router';
import { GeneralInfoFormComponent } from './general-info-form/general-info-form';
import { ClinicalEvaluationFormComponent } from './clinical-evaluation-form/clinical-evaluation-form';
import { Authorization } from '../../../models/evaluation/authorization.model';
import { ClinicalEvaluation } from '../../../models/evaluation/clinical-evaluation.model';
import { ClinicalHistory } from '../../../models/evaluation/clinical-history.model';
import { DiagnosisAndTreatment } from '../../../models/evaluation/diagnosis-treatment.model';
import { EvaluationGeneralInfo } from '../../../models/evaluation/general-info.model';
import { MainComplaints } from '../../../models/evaluation/main-complaints.model';
import { ProfessionalAndPhysicalData } from '../../../models/evaluation/professional-physical.model';
import { WellBeing } from '../../../models/evaluation/well-being.model';
import { Evaluation } from '../../../models/evaluation/evaluation.model';
import { IS_MOBILE } from '../../../../../core/tokens/mobile.token';

@Component({
  selector: 'app-evaluation-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatStepperModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    NgxMatSelectSearchModule,
    ProfessionalPhysicalForm,
    ClinicalHistoryForm,
    MainComplaintsFormComponent,
    WellBeingFormComponent,
    DiagnosisTreatmentFormComponent,
    AuthorizationFormComponent,
    GeneralInfoFormComponent,
    ClinicalEvaluationFormComponent
  ],
  templateUrl: './evaluation-form.component.html',
  styleUrl: './evaluation-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EvaluationFormComponent {
  isMobile = inject(IS_MOBILE);
  coachApiService = inject(CoachApiService);
  route = inject(ActivatedRoute);
  model = input<Evaluation>();

  evaluationCreate = output<Partial<Evaluation>>();

  clinicalEvaluationForm = new FormGroup({
    systems: new FormControl<string | null>(null)
  });
  coachFilterCtrl = new FormControl('');
  evaluation?: Partial<Evaluation>;

  isValid = signal(false);
  coaches = toSignal(this.coachApiService.getCoaches(), { initialValue: [] });
  coachFilter = toSignal(this.coachFilterCtrl.valueChanges, { initialValue: '' });
  filteredCoaches = computed(() => {
    const search = this.coachFilter()?.toLowerCase();
    if (!search?.trim()) {
      return this.coaches();
    }

    return this.coaches().filter(
      (item) =>
        item.name.toLowerCase().includes(search) || item.employeeNumber.toString().includes(search)
    );
  });

  onStepOneChange(event: ProfessionalAndPhysicalData) {
    this.evaluation = { ...this.evaluation, professionalAndPhysicalData: event };
  }

  onStepTwoChange(data: ClinicalHistory) {
    this.evaluation = { ...this.evaluation, clinicalHistory: data };
  }

  onStepThreeChange(data: MainComplaints) {
    this.evaluation = { ...this.evaluation, mainComplaints: data };
  }

  onStepFourChange(data: WellBeing) {
    this.evaluation = { ...this.evaluation, routineAndWellBeing: data };
  }

  onStepFiveChange(data: DiagnosisAndTreatment) {
    this.evaluation = { ...this.evaluation, diagnosisAndTreatment: data };
  }

  onStepSixChange(data: Authorization) {
    this.evaluation = { ...this.evaluation, authorization: data };
  }

  onStepSevenChange(data: EvaluationGeneralInfo) {
    this.evaluation = {
      ...this.evaluation,
      notes: data.notes,
      date: data.date,
      coachId: data.coachId,
      clientId: this.route.snapshot.params['id']
    };
  }

  onClinicalEvaluationChange(data: ClinicalEvaluation) {
    this.evaluation = { ...this.evaluation, clinicalEvaluation: data };
  }

  onSubmit(): void {
    if (this.evaluation) {
      this.evaluationCreate.emit(this.evaluation);
    }
  }
}
