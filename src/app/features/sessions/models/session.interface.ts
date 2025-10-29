import { Client } from '../../clients/models/client.interface';
import { Coach } from '../../coaches/models/coach.model';

export interface Session {
  id: string;
  client: Client;
  coach: Coach;
  startDate: number;
  endDate: number;
  description?: string;
}
