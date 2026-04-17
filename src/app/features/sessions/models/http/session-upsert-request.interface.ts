export interface SessionUpsertRequest {
  clientId: string;
  employeeId: string;
  startDate: number;
  endDate: number;
  type: string;
  location: string;
}
