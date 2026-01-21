export function extractTimeFromIso(iso: string | number | Date): string {
  const dateObject: Date = new Date(iso);
  const hours: string = dateObject.getHours().toString().padStart(2, "0");
  const minutes: string = dateObject.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function extractDateFromIso(isoString: string | number | Date): string {
  const dateObject: Date = new Date(isoString);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObject.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
