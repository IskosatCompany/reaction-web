export interface ExportPdfRequest {
  clientId: string;
  startDate?: number;
  endDate?: number;
  withSessions: boolean;
}
