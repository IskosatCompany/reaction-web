import {
  SessionLocation,
  sessionLocationLabel,
  SessionType,
  sessionTypeCalendarLabel
} from '../../features/sessions/models/session.interface';

export const formatCalendarSessionTitle = (
  clientName: string,
  clientNumber: number,
  sessionType: SessionType,
  sessionLocation: SessionLocation
): string => {
  const formattedClient = `#${clientNumber} - ${clientName}`;
  const locationLabel = sessionLocation ? ` (${sessionLocationLabel[sessionLocation]})` : '';
  const sessionTypeLabel = sessionType ? ` (${sessionTypeCalendarLabel[sessionType]})` : '';
  return `${sessionTypeLabel} ${formattedClient}${locationLabel}`;
};
