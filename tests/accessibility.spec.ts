import { expect, test } from '../support/fixtures.js';

test.describe('Accesibilidad', () => {
  test('el mes actual no tiene problemas de accesibilidad', async ({ app }) => {
    await app.expectAccessible();
  });

  test('el editor abierto con errores no tiene problemas de accesibilidad', async ({ app }) => {
    await app.button('Agregar gasto').click();
    await app.button('Agregar').click();
    await expect(app.movements).toContainText('Escribí un título.');

    await app.expectAccessible();
  });

  test('un mes cerrado no tiene problemas de accesibilidad', async ({ app }) => {
    await app.goToPreviousMonth();
    await expect(app.page.getByText('Mes cerrado', { exact: true })).toBeVisible();

    await app.expectAccessible();
  });

  test('las tostadas no tienen problemas de accesibilidad', async ({ app }) => {
    await app.button('Eliminar Alquiler').click();
    await expect(app.successToasts).toContainText('Eliminaste «Alquiler».');

    await app.expectAccessible();
  });

  test('se edita con el teclado y el foco vuelve a la fila al cancelar', async ({ app }) => {
    const editButton = app.button('Editar Alquiler');
    await editButton.focus();

    await app.page.keyboard.press('Enter');
    const title = app.editor('Editar movimiento').getByLabel('Título');
    await expect(title).toBeFocused();

    await app.page.keyboard.press('Escape');
    await expect(app.button('Editar Alquiler')).toBeFocused();
  });

  test('al agregar con el teclado el foco vuelve al botón de agregar', async ({ app }) => {
    await app.button('Agregar ingreso').focus();
    await app.page.keyboard.press('Enter');
    await expect(app.editor('Nuevo movimiento').getByLabel('Título')).toBeFocused();

    await app.page.keyboard.press('Escape');
    await expect(app.button('Agregar ingreso')).toBeFocused();
  });
});
