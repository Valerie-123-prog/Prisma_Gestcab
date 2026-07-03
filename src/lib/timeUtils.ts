/** Convertit une heure "HH:MM" en minutes depuis minuit. */
export function timeToMinutes(time: string): number {
  const [hours, mins] = time.split(':').map(Number);
  return hours * 60 + mins;
}

/** Ajoute des minutes à une heure "HH:MM" et renvoie le résultat au même format. */
export function addMinutesToTime(time: string, minutes: number): string {
  const totalMinutes = timeToMinutes(time) + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

/**
 * Vrai si les deux intervalles horaires [startA, endA) et [startB, endB)
 * se chevauchent, même partiellement.
 */
export function timeRangesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(endA) > timeToMinutes(startB);
}
