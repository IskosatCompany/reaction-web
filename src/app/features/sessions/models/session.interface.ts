import { Client } from '../../clients/models/client.interface';
import { Coach } from '../../coaches/models/coach.interface';

export interface Session {
  id: string;
  client: Client;
  coach: Coach;
  startDate: Date;
  endDate: Date;
  description?: string;
}
