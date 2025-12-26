import { PhysicalTest } from './physical-test.model';

export interface ClinicalEvaluation {
  systems?: string;
  perimeters?: PhysicalTest[];
}
