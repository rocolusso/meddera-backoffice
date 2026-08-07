export function formatDateDisplay(isoOrDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoOrDate);
  if (match) {
    return `${match[3]}.${match[2]}.${match[1]}`;
  }
  return isoOrDate;
}

export function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
