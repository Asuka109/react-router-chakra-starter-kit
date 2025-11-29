import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function createDatabaseClient(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;
