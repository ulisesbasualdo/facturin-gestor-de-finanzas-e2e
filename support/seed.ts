import { SeedItem } from './_definitions.js';
import { CURRENT_MONTH, NEXT_MONTH, PREVIOUS_MONTH } from './months.js';

/** Movimientos con los que arranca cada test, en el orden en que se insertan (el último es el más reciente). */
export const DEFAULT_SEED: SeedItem[] = [
  { title: 'Sueldo', price: 1000, completed: true, yearMonth: PREVIOUS_MONTH, isGain: true },
  { title: 'Alquiler', price: 400, completed: true, yearMonth: PREVIOUS_MONTH, isGain: false },
  { title: 'Sueldo', price: 2000, completed: true, yearMonth: CURRENT_MONTH, isGain: true },
  { title: 'Trabajo freelance', price: 500, completed: false, yearMonth: CURRENT_MONTH, isGain: true },
  { title: 'Alquiler', price: 800, completed: true, yearMonth: CURRENT_MONTH, isGain: false },
  { title: 'Luz y gas', price: 100.5, completed: false, yearMonth: CURRENT_MONTH, isGain: false },
  { title: 'Alquiler', price: 800, completed: false, yearMonth: NEXT_MONTH, isGain: false },
];

/** Valores que el backend tiene que calcular para el mes actual con `DEFAULT_SEED`. */
export const CURRENT_MONTH_SUMMARY = {
  /** Cobrado (2000) − pagado (800) − gastos pendientes (100.5). */
  projectedMonthEnd: '1099.5',
  /** Lo anterior más los ingresos por cobrar (500). */
  projectedWithPendingIncome: '1599.5',
  /** Ahorro del mes anterior (1000 − 400) más lo proyectado este mes. */
  totalProjectedSavings: '1699.5',
  /** Texto de progreso de los ingresos. */
  incomeProgress: 'Cobrado 2000 de 2500',
  /** Texto de progreso de los gastos. */
  expenseProgress: 'Pagado 800 de 900.5',
};
