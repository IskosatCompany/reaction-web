import { Client } from '../../clients/models/client.interface';
import { Coach } from '../../coaches/models/coach.model';

export type SessionAction = 'duplicate' | 'delete' | 'close' | 'goToClient';

export enum SessionStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED'
}

export const SessionStatusLabel: Record<SessionStatus, string> = {
  [SessionStatus.Completed]: 'Finalizada',
  [SessionStatus.Pending]: 'Pendente'
};

export enum SessionType {
  Training = 'Treino',
  PhysicalEvaluation = 'Avaliação Física',
  Treatment = 'Tratamento',
  Osteopathy = 'Consulta de Osteopatia',
  Psychology = 'Consulta de Psicologioa',
  Nutrition = 'Consulta de Nutrição',
  Podiatry = 'Consulta de Podologia',
  Physiotherapy = 'Consulta de Fisioterapia'
}

export const sessionTypeCalendarLabel: Record<SessionType, string> = {
  [SessionType.Training]: 'T',
  [SessionType.PhysicalEvaluation]: 'AF',
  [SessionType.Treatment]: 'TT',
  [SessionType.Osteopathy]: 'CO',
  [SessionType.Psychology]: 'CP',
  [SessionType.Nutrition]: 'CN',
  [SessionType.Podiatry]: 'CPD',
  [SessionType.Physiotherapy]: 'CF'
};
export interface Session {
  id: string;
  client: Client;
  coach: Coach;
  startDate: number;
  endDate: number;
  report?: string;
  status: SessionStatus;
  type: string;
}
