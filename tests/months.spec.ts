import { expect, test } from '../support/fixtures.js';
import { monthNameFromToday } from '../support/months.js';

test.describe('Cierre y reapertura de meses', () => {
  test('un mes cerrado no permite modificar sus movimientos', async ({ app }) => {
    await app.goToPreviousMonth();

    await expect(app.page.getByText('Mes cerrado', { exact: true })).toBeVisible();
    await expect(app.rowTitles('Gastos')).toHaveText(['Alquiler']);
    await expect(app.button('Agregar gasto')).toHaveCount(0);
    await expect(app.button('Editar Alquiler')).toHaveCount(0);
    await expect(app.button('Eliminar Alquiler')).toHaveCount(0);
  });

  test('reabrir permite modificar y al salir el mes se vuelve a cerrar', async ({ app }) => {
    const previousName = monthNameFromToday(-1);
    await app.goToPreviousMonth();

    await app.button('Reabrir mes').click();

    await expect(app.successToasts).toContainText(`Reabriste ${previousName}.`);
    await expect(app.page.getByText(/Mes reabierto/)).toBeVisible();
    await expect(app.button('Agregar gasto')).toBeVisible();

    await app.goToNextMonth();
    await expect(app.successToasts).toContainText(`${previousName} se volvió a cerrar.`);

    await app.goToPreviousMonth();
    await expect(app.page.getByText('Mes cerrado', { exact: true })).toBeVisible();
  });

  test('cerrar el mes cierra el editor que estaba abierto', async ({ app }) => {
    await app.goToPreviousMonth();
    await app.button('Reabrir mes').click();
    await app.button('Agregar gasto').click();
    await expect(app.editor('Nuevo movimiento')).toBeVisible();

    await app.button('Cerrar mes').click();

    await expect(app.page.getByText('Mes cerrado', { exact: true })).toBeVisible();
    await expect(app.editor('Nuevo movimiento')).toHaveCount(0);
  });

  test('el mes siguiente se puede planificar', async ({ app }) => {
    await app.goToNextMonth();

    await expect(app.page.getByText(/Mes próximo/)).toBeVisible();
    await expect(app.rowTitles('Gastos')).toHaveText(['Alquiler']);
    await expect(app.button('Agregar gasto')).toBeVisible();
  });
});
