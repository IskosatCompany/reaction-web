import {
  SessionType,
  sessionTypeCalendarLabel
} from '../../features/sessions/models/session.interface';

export const formatCalendarSessionTitle = (
  clientName: string,
  clientNumber: number,
  sessionType: SessionType
): string => {
  const formattedClient = `#${clientNumber} - ${clientName}`;
  const sessionTypeLabel = sessionType ? ` (${sessionTypeCalendarLabel[sessionType]})` : '';
  return `${sessionTypeLabel} ${formattedClient}`;
};
