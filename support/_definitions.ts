/** Movimiento que se carga directamente en la base de prueba. */
export interface SeedItem {
  /** Descripción del movimiento. */
  title: string;
  /** Monto. */
  price: number;
  /** Indica si ya se cobró o pagó. */
  completed: boolean;
  /** Mes en formato `YYYY-MM`. */
  yearMonth: string;
  /** `true` si es ingreso, `false` si es gasto. */
  isGain: boolean;
}

/** Nombre visible de cada grupo de movimientos. */
export type GroupName = 'Ingresos' | 'Gastos';
