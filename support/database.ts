import mysql from 'mysql2/promise';
import { SeedItem } from './_definitions.js';
import { testDatabase } from './env.js';

/** Vacía la base de prueba y carga los movimientos indicados. */
export async function resetDatabase(items: SeedItem[]): Promise<void> {
  const connection = await mysql.createConnection(testDatabase);
  try {
    await connection.query('TRUNCATE TABLE month_close');
    await connection.query('TRUNCATE TABLE item');
    for (const item of items) {
      await connection.execute(
        'INSERT INTO item (title, price, completed, yearMonth, isGain) VALUES (?, ?, ?, ?, ?)',
        [item.title, item.price, item.completed, item.yearMonth, item.isGain],
      );
    }
  } finally {
    await connection.end();
  }
}
