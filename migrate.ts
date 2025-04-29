import { pool, db } from './server/db';
import { products } from './shared/schema';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    console.log('Starting migration...');
    
    // Add missing columns to products table
    await db.execute(sql`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS screenshots TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS demo_url TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS logo TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
    `);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

main();