import { PhysicalTestForm } from '../../../../models/evaluation/physical-test.model';

export interface ClinicalEvaluationForm {
  systems: string | null;
  perimeters: PhysicalTestForm[] | null;
}
