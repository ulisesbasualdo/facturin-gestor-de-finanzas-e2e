import { expect, test } from '../support/fixtures.js';
import { monthNameFromToday } from '../support/months.js';
import { CURRENT_MONTH_SUMMARY } from '../support/seed.js';

test.describe('Resumen y lista del mes', () => {
  test('muestra el resumen del mes actual calculado por el backend', async ({ app }) => {
    await expect(app.monthHeading).toContainText(monthNameFromToday(0));
    await expect(app.projected).toHaveText(CURRENT_MONTH_SUMMARY.projectedMonthEnd);
    await expect(app.summary).toContainText(`Ahorrás ${CURRENT_MONTH_SUMMARY.projectedMonthEnd}`);
    await expect(app.summary).toContainText(CURRENT_MONTH_SUMMARY.totalProjectedSavings);
  });

  test('el switch suma los ingresos por cobrar a la proyección', async ({ app }) => {
    const toggle = app.page.getByRole('switch', { name: 'Sumar ingresos por cobrar' });
    await expect(toggle).toHaveAttribute('aria-checked', 'false');

    await toggle.click();

    await expect(toggle).toHaveAttribute('aria-checked', 'true');
    await expect(app.projected).toHaveText(CURRENT_MONTH_SUMMARY.projectedWithPendingIncome);
  });

  test('agrupa los movimientos en ingresos y gastos con sus totales', async ({ app }) => {
    await expect(app.group('Ingresos').locator('.progress')).toHaveText(
      CURRENT_MONTH_SUMMARY.incomeProgress,
    );
    await expect(app.group('Gastos').locator('.progress')).toHaveText(
      CURRENT_MONTH_SUMMARY.expenseProgress,
    );
    await expect(app.rowTitles('Ingresos')).toHaveText(['Trabajo freelance', 'Sueldo']);
    await expect(app.rowTitles('Gastos')).toHaveText(['Luz y gas', 'Alquiler']);
    await expect(app.row('Ingresos', 'Trabajo freelance')).toContainText('Por cobrar');
    await expect(app.row('Gastos', 'Alquiler')).toContainText('Pagado');
  });

  test('navega al mes anterior y vuelve a hoy', async ({ app }) => {
    await app.goToPreviousMonth();

    await expect(app.monthHeading).toContainText(monthNameFromToday(-1));
    await expect(app.page.getByText('Mes cerrado', { exact: true })).toBeVisible();

    await app.button('Volver a hoy').click();

    await expect(app.monthHeading).toContainText(monthNameFromToday(0));
    await expect(app.button('Volver a hoy')).toHaveCount(0);
  });

  test('ordena por monto y recuerda la preferencia al recargar', async ({ app }) => {
    await expect(app.rowTitles('Gastos')).toHaveText(['Luz y gas', 'Alquiler']);

    await app.page.getByLabel('Ordenar por').selectOption({ label: 'Mayor monto' });
    await expect(app.rowTitles('Gastos')).toHaveText(['Alquiler', 'Luz y gas']);

    await app.page.reload();
    await expect(app.rowTitles('Gastos')).toHaveText(['Alquiler', 'Luz y gas']);
    await expect(app.page.getByLabel('Ordenar por')).toHaveValue('priceDesc');
  });
});
