import { SessionType } from '../session.interface';

export interface SessionUpsertRequest {
  clientId: string;
  coachId: string;
  startDate: number;
  endDate: number;
  type: SessionType;
}
