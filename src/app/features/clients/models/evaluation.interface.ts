export interface Evaluation {
  id: string;
  title: string;
  date: Date;
  description: string;
  coachId: string;
  clientId: string;
}

export interface EvaluationForm {
  title: string | null;
  date: Date | null;
  description: string | null;
  coachId: string | null;
  clientId: string | null;
}

export interface UpsertEvaluation extends Omit<EvaluationForm, 'date'> {
  date: number | null;
}
