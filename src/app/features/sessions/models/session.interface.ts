import { Client } from '../../clients/models/client.interface';
import { Coach } from '../../coaches/models/coach.model';

export type SessionAction = 'duplicate' | 'delete' | 'close' | 'goToClient' | 'absence';

export enum SessionStatus {
  Absence = 'ABSENCE',
  Completed = 'COMPLETED',
  Pending = 'PENDING'
}

export const SessionStatusLabel: Record<SessionStatus, string> = {
  [SessionStatus.Absence]: 'Falta',
  [SessionStatus.Completed]: 'Finalizada',
  [SessionStatus.Pending]: 'Pendente'
};

export enum SessionType {
  Training = 'TRAINING',
  Treatment = 'TREATMENT'
}

export const SessionTypeLabel: Record<SessionType, string> = {
  [SessionType.Training]: 'Treino',
  [SessionType.Treatment]: 'Tratamento'
};

export interface Session {
  id: string;
  client: Client;
  coach: Coach;
  startDate: number;
  endDate: number;
  report?: string;
  status: SessionStatus;
  type: SessionType;
}
