import { expect, test } from '../support/fixtures.js';

test.describe('Alta, edición y acciones sobre movimientos', () => {
  test('agrega un gasto, que aparece primero y actualiza los totales', async ({ app }) => {
    await app.button('Agregar gasto').click();
    const editor = app.editor('Nuevo movimiento');
    await editor.getByLabel('Título').fill('Internet');
    await editor.getByLabel('Monto').fill('45.75');
    await editor.getByLabel('Monto').press('Enter');

    await expect(editor).toHaveCount(0);
    await expect(app.rowTitles('Gastos').first()).toHaveText('Internet');
    await expect(app.group('Gastos').locator('.progress')).toHaveText('Pagado 800 de 946.25');
    await expect(app.projected).toHaveText('1053.75');
  });

  test('con datos inválidos no agrega nada, muestra los errores y enfoca el título', async ({ app }) => {
    await app.button('Agregar gasto').click();
    const editor = app.editor('Nuevo movimiento');
    await editor.getByLabel('Monto').fill('12,5');

    await app.button('Agregar').click();

    await expect(app.movements).toContainText('Escribí un título.');
    await expect(app.movements).toContainText('El monto tiene que ser un número con hasta 2 decimales.');
    await expect(editor.getByLabel('Título')).toBeFocused();
    await expect(app.rowTitles('Gastos')).toHaveCount(2);
  });

  test('edita el monto de un movimiento', async ({ app }) => {
    await app.button('Editar Alquiler').click();
    const editor = app.editor('Editar movimiento');
    await expect(editor.getByLabel('Título')).toHaveValue('Alquiler');

    await editor.getByLabel('Monto').fill('850');
    await app.button('Guardar').click();

    await expect(editor).toHaveCount(0);
    await expect(app.row('Gastos', 'Alquiler')).toContainText('850');
    await expect(app.projected).toHaveText('1049.5');
  });

  test('Escape cancela la edición sin guardar', async ({ app }) => {
    await app.button('Editar Alquiler').click();
    const editor = app.editor('Editar movimiento');
    await editor.getByLabel('Título').fill('Otro título');

    await editor.getByLabel('Título').press('Escape');

    await expect(editor).toHaveCount(0);
    await expect(app.rowTitles('Gastos')).toHaveText(['Luz y gas', 'Alquiler']);
  });

  test('marca un gasto como pagado', async ({ app }) => {
    await app.button('Marcar «Luz y gas» como pagado').click();

    await expect(app.row('Gastos', 'Luz y gas')).toContainText('Pagado');
    await expect(app.group('Gastos').locator('.progress')).toHaveText('Pagado 900.5 de 900.5');
  });

  test('duplica un movimiento y lo avisa', async ({ app }) => {
    await app.button('Duplicar Alquiler').click();

    await expect(app.successToasts).toContainText('Duplicaste «Alquiler».');
    await expect(app.rowTitles('Gastos')).toHaveText(['Alquiler', 'Luz y gas', 'Alquiler']);
  });

  test('elimina un movimiento y lo restaura desde la tostada', async ({ app }) => {
    await app.button('Eliminar Alquiler').click();

    await expect(app.successToasts).toContainText('Eliminaste «Alquiler».');
    await expect(app.rowTitles('Gastos')).toHaveText(['Luz y gas']);

    await app.button('Deshacer').click();

    await expect(app.successToasts).toContainText('Restauraste «Alquiler».');
    await expect(app.rowTitles('Gastos')).toHaveText(['Alquiler', 'Luz y gas']);
  });

  test('la tostada de un borrado no desaparece sola, pero se cierra al cambiar de mes', async ({ app }) => {
    await app.button('Eliminar Alquiler').click();
    const toast = app.successToasts.filter({ hasText: 'Eliminaste «Alquiler».' });
    await expect(toast).toBeVisible();

    await app.page.waitForTimeout(6_000);
    await expect(toast).toBeVisible();

    await app.goToNextMonth();
    await expect(toast).toHaveCount(0);
  });
});
