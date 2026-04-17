import { SessionStatus } from '../session.interface';

export interface SessionDto {
  id: string;
  clientId: string;
  employeeId: string;
  startDate: number;
  endDate: number;
  report?: string;
  status: SessionStatus;
  type: string;
  location?: string;
}
