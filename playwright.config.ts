import { defineConfig, devices } from '@playwright/test';
import { BACKEND_DIR, backendDatabaseEnv, FRONTEND_DIR } from './support/env.js';

/** URL del backend Nest. */
const BACKEND_URL = 'http://localhost:3000';
/** URL del frontend Angular. */
const FRONTEND_URL = 'http://localhost:4200';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './support/global-setup.ts',
  use: {
    baseURL: FRONTEND_URL,
    locale: 'es-AR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run start',
      cwd: BACKEND_DIR,
      url: BACKEND_URL,
      env: { ...backendDatabaseEnv, LOG_LEVEL: 'warn' },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm run start',
      cwd: FRONTEND_DIR,
      url: FRONTEND_URL,
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
});
