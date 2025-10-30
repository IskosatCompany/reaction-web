import { Client } from '../../clients/models/client.interface';
import { Coach } from '../../coaches/models/coach.model';

export enum SessionStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED'
}

export interface Session {
  id: string;
  client: Client;
  coach: Coach;
  startDate: number;
  endDate: number;
  description?: string;
  report?: string;
  status: SessionStatus;
}
