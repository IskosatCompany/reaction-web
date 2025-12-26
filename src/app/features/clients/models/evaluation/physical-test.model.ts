export interface PhysicalTest {
  muscleGroup?: string;
  left?: number;
  right?: number;
  rsi?: number;
}

export interface PhysicalTestForm {
  muscleGroup: string | null;
  left: number | null;
  right: number | null;
  rsi: number | null;
}
