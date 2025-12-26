import { PhysicalTest, PhysicalTestForm } from '../../../../models/evaluation/physical-test.model';

export interface PhysicalTests {
  isometricStrengthTests?: PhysicalTest[];
  mobilityTests?: PhysicalTest[];
  jumpTests?: PhysicalTest[];
  isoinertialTests?: PhysicalTest[];
}

export interface PhysicalTestsForm {
  isometricStrengthTests: PhysicalTestForm[] | null;
  mobilityTests: PhysicalTestForm[] | null;
  jumpTests: PhysicalTestForm[] | null;
  isoinertialTests: PhysicalTestForm[] | null;
}
