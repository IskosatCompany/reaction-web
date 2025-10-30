import { SessionStatus } from '../session.interface';

export interface SessionDto {
  id: string;
  clientId: string;
  coachId: string;
  startDate: number;
  endDate: number;
  description?: string;
  report?: string;
  status: SessionStatus;
}
