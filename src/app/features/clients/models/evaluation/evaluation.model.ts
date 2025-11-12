import { Authorization } from './authorization.model';
import { ClinicalEvaluation } from './clinical-evaluation.model';
import { ClinicalHistory } from './clinical-history.model';
import { DiagnosisAndTreatment } from './diagnosis-treatment.model';
import { MainComplaints } from './main-complaints.model';
import { ProfessionalAndPhysicalData } from './professional-physical.model';
import { WellBeing } from './well-being.model';

// export interface Evaluation {
//   id: string;
//   title: string;
//   date: Date;
//   description: string;
//   coachId: string;
//   clientId: string;
// }

// export interface EvaluationForm {
//   title: string | null;
//   date: Date | null;
//   description: string | null;
//   coachId: string | null;
//   clientId: string | null;
// }

// export interface UpsertEvaluation extends Omit<EvaluationForm, 'date'> {
//   date: number | null;
// }

export interface Evaluation {
  coachId: string;
  clientId: string;
  date: number;
  notes?: string;
  professionalAndPhysicalData?: ProfessionalAndPhysicalData;
  clinicalHistory?: ClinicalHistory;
  mainComplaints?: MainComplaints;
  routineAndWellBeing?: WellBeing;
  diagnosisAndTreatment?: DiagnosisAndTreatment;
  clinicalEvaluation?: ClinicalEvaluation;
  authorization?: Authorization;
}
