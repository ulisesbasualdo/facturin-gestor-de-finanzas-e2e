import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Ruta del `.env` de los tests, con los datos de la base de prueba. */
const ENV_FILE = fileURLToPath(new URL('../.env', import.meta.url));

/** Carpeta del backend Nest. */
export const BACKEND_DIR = fileURLToPath(new URL('../../facturin-back-nest', import.meta.url));
/** Carpeta del frontend Angular. */
export const FRONTEND_DIR = fileURLToPath(new URL('../../facturin-front-angular', import.meta.url));

if (!existsSync(ENV_FILE)) {
  throw new Error('Falta test-auto/.env: copiá .env.example como .env y completá los datos de MySQL.');
}
process.loadEnvFile(ENV_FILE);

/** Lee una variable obligatoria del `.env` de los tests. */
function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Falta ${name} en test-auto/.env.`);
  }
  return value;
}

/** Datos de conexión a la base de prueba. */
export const testDatabase = {
  host: required('TEST_DB_HOST'),
  port: Number(required('TEST_DB_PORT')),
  user: required('TEST_DB_USERNAME'),
  password: process.env['TEST_DB_PASSWORD'] ?? '',
  database: required('TEST_DB_DATABASE'),
};

if (!testDatabase.database.endsWith('_test')) {
  throw new Error(
    `La base "${testDatabase.database}" no termina en _test. Los tests la vacían: usá una base de prueba.`,
  );
}

/** Variables con las que el backend se conecta a la base de prueba en lugar de la de desarrollo. */
export const backendDatabaseEnv: Record<string, string> = {
  DB_HOST: testDatabase.host,
  DB_PORT: String(testDatabase.port),
  DB_USERNAME: testDatabase.user,
  DB_PASSWORD: testDatabase.password,
  DB_DATABASE: testDatabase.database,
};
