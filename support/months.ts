/** Formateador del nombre del mes en español (`octubre`), igual al que usa la app. */
const monthFormatter = new Intl.DateTimeFormat('es-AR', { month: 'long' });

/** Mes en formato `YYYY-MM` desplazado `offset` meses respecto del actual. */
export function yearMonthFromToday(offset: number): string {
  const today = new Date();
  const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** Nombre del mes desplazado `offset` meses respecto del actual, con mayúscula inicial (`Octubre`). */
export function monthNameFromToday(offset: number): string {
  const today = new Date();
  const name = monthFormatter.format(new Date(today.getFullYear(), today.getMonth() + offset, 1));
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Mes anterior al actual (cerrado). */
export const PREVIOUS_MONTH = yearMonthFromToday(-1);
/** Mes actual (abierto). */
export const CURRENT_MONTH = yearMonthFromToday(0);
/** Mes siguiente al actual (abierto, para planificar). */
export const NEXT_MONTH = yearMonthFromToday(1);
