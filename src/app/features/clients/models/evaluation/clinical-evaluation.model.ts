export interface ClinicalEvaluation {
  systems?: string;
  isometricStrengthTests?: IsometricStrengthTests[];
}
export interface IsometricStrengthTests {
  muscleGroup?: string;
  left?: number;
  right?: number;
  rsi?: number;
}
