export interface ClinicalEvaluationForm {
  systems: string | null;
  isometricStrengthTests: IsometricStrengthTestsForm[] | null;
}

export interface IsometricStrengthTestsForm {
  muscleGroup: string | null;
  left: number | null;
  right: number | null;
  rsi: number | null;
}
