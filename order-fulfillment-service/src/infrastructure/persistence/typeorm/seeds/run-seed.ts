import dataSource from '../data-source.js';
import { seedDatabase } from './seed-database.js';

async function seed(): Promise<void> {
  await dataSource.initialize();

  try {
    await seedDatabase(dataSource);
    console.log('Seed completed. Existing records were preserved.');
  } finally {
    await dataSource.destroy();
  }
}

await seed();
