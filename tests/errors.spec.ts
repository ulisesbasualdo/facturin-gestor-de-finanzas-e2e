import { expect, test } from '../support/fixtures.js';

test.describe('Errores del backend', () => {
  test('un error inesperado muestra el código para buscarlo en los logs', async ({ app }) => {
    await app.page.route('**/items/*/duplicate', (route) =>
      route.fulfill({
        status: 500,
        json: { statusCode: 500, message: 'Ocurrió un error inesperado.', errorId: 'e2e-500' },
      }),
    );

    await app.button('Duplicar Alquiler').click();

    await expect(app.errorToast('No pudimos duplicar el movimiento. Código: e2e-500')).toBeVisible();
  });

  test('un error de negocio muestra el mensaje del backend', async ({ app }) => {
    await app.page.route('**/items/*', (route) =>
      route.request().method() === 'PATCH'
        ? route.fulfill({
            status: 409,
            json: { statusCode: 409, message: 'El mes está cerrado. Reabrilo para modificarlo.' },
          })
        : route.continue(),
    );

    await app.button('Marcar «Luz y gas» como pagado').click();

    await expect(app.errorToast('El mes está cerrado. Reabrilo para modificarlo.')).toBeVisible();
  });

  test('si el backend no responde, el resumen lo avisa', async ({ app }) => {
    await app.page.route('**/summary', (route) => route.abort());

    await app.page.reload();

    await expect(app.page.getByText('No pudimos cargar el resumen de este mes.')).toBeVisible();
  });
});
