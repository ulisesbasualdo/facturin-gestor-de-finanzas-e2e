import { test as base } from '@playwright/test';
import { resetDatabase } from './database.js';
import { FacturinApp } from './facturin-app.js';
import { DEFAULT_SEED } from './seed.js';

/** `test` de Playwright con `app`: la base recién cargada con `DEFAULT_SEED` y la app abierta en el mes actual. */
export const test = base.extend<{ app: FacturinApp }>({
  app: async ({ page }, use) => {
    await resetDatabase(DEFAULT_SEED);
    await page.goto('/');
    const app = new FacturinApp(page);
    await app.summary.getByText('Quedará al cierre de mes').waitFor();
    await use(app);
  },
});

export { expect } from '@playwright/test';
