export interface SessionDto {
  id: string;
  clientId: string;
  coachId: string;
  startDate: number;
  endDate: number;
  description?: string;
  reportId?: string;
}
