import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';
import 'dotenv/config';

async function migrate() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error('Missing Turso credentials');
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const sql = readFileSync('./migrate.sql', 'utf8');

  // libsql doesn't support executing multiple statements at once if there are many complex ones, 
  // but we can try executeMultiple, which is supported for this.
  try {
    console.log('Executing migration on Turso...');
    await client.executeMultiple(sql);
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrate();
