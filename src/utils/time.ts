export type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * Convertit un nombre entier de secondes en jours/heures/minutes/secondes.
 * - Si la valeur est négative, les parties retournées sont aussi négatives et calculées sur la valeur absolue.
 * - Les valeurs retournées sont arrondies vers zéro (entiers).
 */
export function secondsToDhms(totalSeconds: number, dayHours = 24): TimeParts {
  const sign = totalSeconds < 0 ? -1 : 1;
  let remaining = Math.abs(Math.trunc(totalSeconds));

  // nombre de secondes par 'jour' configurable
  // allow fractional hoursPerDay (e.g. 7.5).
  const dayHoursNumber = Number(dayHours) || 24
  const secondsPerDay = Math.max(1, dayHoursNumber) * 3600

  const days = Math.floor(remaining / secondsPerDay);
  remaining = remaining % secondsPerDay;

  const hours = Math.floor(remaining / 3600);
  remaining = remaining % 3600;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return {
    days: days * sign,
    hours: hours * sign,
    minutes: minutes * sign,
    seconds: seconds * sign,
  };
}

/**
 * Retourne une chaîne lisible comme "Xd Yh Zm Ws" (les parties nulles sont omises)
 */
export function formatDhms(totalSeconds: number, dayHours = 24): string {
  const { days, hours, minutes, seconds } = secondsToDhms(totalSeconds, dayHours);
  const parts: string[] = [];
  if (Math.abs(days) > 0) parts.push(`${days}j`);
  if (Math.abs(hours) > 0) parts.push(`${hours}h`);
  if (Math.abs(minutes) > 0) parts.push(`${minutes}m`);
  if (Math.abs(seconds) > 0 || parts.length === 0) parts.push(`${seconds}s`);
  return parts.join(' ');
}

/**
 * Calcule le nombre de secondes nécessaires pour gagner `amount` USD
 * - netAnnual: salaire net annuel en USD
 * - workingMsPerYear: nombre de millisecondes travaillées par an
 * Retourne `Infinity` si on ne peut pas obtenir un taux (division par 0).
 */
export function secondsToEarnAmount(amount: number, netAnnual: number, workingMsPerYear: number): number {
  if (!isFinite(amount) || !isFinite(netAnnual) || !isFinite(workingMsPerYear)) return Infinity
  if (netAnnual === 0 || workingMsPerYear === 0) return Infinity
  const usdPerMs = netAnnual / workingMsPerYear
  if (usdPerMs === 0) return Infinity
  const requiredMs = amount / usdPerMs
  return requiredMs / 1000
}
