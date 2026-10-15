import { AxeBuilder } from '@axe-core/playwright';
import { expect, Locator, Page } from '@playwright/test';
import { GroupName } from './_definitions.js';

/** Reglas de axe que se verifican: WCAG 2.0, 2.1 y 2.2 niveles A y AA. */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/** Acceso a las partes de la pantalla de Facturín, buscadas por su rol y nombre accesible. */
export class FacturinApp {
  /** Card con el resumen del mes. */
  readonly summary: Locator;
  /** Monto grande de "Quedará al cierre de mes". */
  readonly projected: Locator;
  /** Sección con los movimientos del mes. */
  readonly movements: Locator;
  /** Título del mes seleccionado. */
  readonly monthHeading: Locator;
  /** Tostadas de confirmación. */
  readonly successToasts: Locator;

  constructor(readonly page: Page) {
    this.summary = page.getByRole('region', { name: 'Resumen del mes' });
    this.projected = this.summary.locator('.hero-amount');
    this.movements = page.getByRole('region', { name: 'Movimientos del mes' });
    this.monthHeading = page.getByRole('heading', { level: 1 });
    this.successToasts = page.getByRole('status');
  }

  /** Grupo de ingresos o de gastos. */
  group(name: GroupName): Locator {
    return this.movements
      .locator('app-item-group')
      .filter({ has: this.page.getByRole('heading', { level: 3, name }) });
  }

  /** Títulos de las filas de un grupo, en el orden en que se muestran. */
  rowTitles(name: GroupName): Locator {
    return this.group(name).locator('app-item-row .title');
  }

  /** Fila de un grupo que contiene el texto indicado. */
  row(name: GroupName, title: string): Locator {
    return this.group(name).locator('app-item-row').filter({ hasText: title });
  }

  /** Botón por su nombre accesible exacto. */
  button(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  /** Formulario del editor (`Nuevo movimiento` o `Editar movimiento`). */
  editor(name: 'Nuevo movimiento' | 'Editar movimiento'): Locator {
    return this.page.getByRole('form', { name });
  }

  /** Tostada de error que contiene el texto indicado. */
  errorToast(text: string): Locator {
    return this.page.locator('app-toast-list').getByRole('alert').filter({ hasText: text });
  }

  /** Va al mes anterior con la flecha. */
  async goToPreviousMonth(): Promise<void> {
    await this.page.getByRole('button', { name: /^Mes anterior/ }).click();
  }

  /** Va al mes siguiente con la flecha. */
  async goToNextMonth(): Promise<void> {
    await this.page.getByRole('button', { name: /^Mes siguiente/ }).click();
  }

  /** Verifica con axe que la pantalla, en su estado actual, no tenga problemas de accesibilidad WCAG AA. */
  async expectAccessible(): Promise<void> {
    const results = await new AxeBuilder({ page: this.page }).withTags(WCAG_TAGS).analyze();
    const violations = results.violations.map((violation) => ({
      regla: violation.id,
      problema: violation.help,
      elementos: violation.nodes.map((node) => node.target.join(' ')),
    }));
    expect(violations, 'Problemas de accesibilidad encontrados por axe').toEqual([]);
  }
}
