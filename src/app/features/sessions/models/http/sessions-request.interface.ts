import { SessionStatus } from '../session.interface';

export interface SessionsRequest {
  startDate?: number;
  endDate?: number;
  clientId?: string;
  coachId?: string;
  status?: SessionStatus;
}
