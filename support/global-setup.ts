import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BACKEND_DIR, backendDatabaseEnv, FRONTEND_DIR } from './env.js';

/** Antes de todos los tests: verifica que el frontend use el backend real y migra la base de prueba. */
export default function globalSetup(): void {
  const environment = readFileSync(
    join(FRONTEND_DIR, 'src', 'environments', 'environment.development.ts'),
    'utf8',
  );
  if (environment.includes('mockable: true')) {
    throw new Error(
      'El frontend está en modo mock. Poné "mockable: false" en environment.development.ts antes de correr los tests E2E.',
    );
  }

  execSync('npm run migration:run', {
    cwd: BACKEND_DIR,
    env: { ...process.env, ...backendDatabaseEnv },
    stdio: 'inherit',
  });
}
