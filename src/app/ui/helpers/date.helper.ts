export function toTimestamp(date: Date | null, endOfDay = false): number | undefined {
  if (!date) {
    return undefined;
  }

  const value = new Date(date);
  value.setHours(endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);

  return value.getTime();
}
