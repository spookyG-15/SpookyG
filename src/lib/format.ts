const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function toUtcMidnight(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00Z`).getTime();
}

function startOfTodayUtc(): number {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today.getTime();
}

export function formatDate(isoDate: string): string {
  const date = new Date(toUtcMidnight(isoDate));
  if (Number.isNaN(date.getTime())) return isoDate;
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function daysSince(isoDate: string): number {
  return Math.floor((startOfTodayUtc() - toUtcMidnight(isoDate)) / 86_400_000);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
