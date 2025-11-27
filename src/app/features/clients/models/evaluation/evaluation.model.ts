import { Authorization } from './authorization.model';
import { ClinicalEvaluation } from './clinical-evaluation.model';
import { ClinicalHistory } from './clinical-history.model';
import { DiagnosisAndTreatment } from './diagnosis-treatment.model';
import { MainComplaints } from './main-complaints.model';
import { ProfessionalAndPhysicalData } from './professional-physical.model';
import { WellBeing } from './well-being.model';

export interface Evaluation {
  id?: string;
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
