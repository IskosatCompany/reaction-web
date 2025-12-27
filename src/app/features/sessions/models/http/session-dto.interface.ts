import { SessionStatus, SessionType } from '../session.interface';

export interface SessionDto {
  id: string;
  clientId: string;
  coachId: string;
  startDate: number;
  endDate: number;
  report?: string;
  status: SessionStatus;
  type: SessionType;
}
