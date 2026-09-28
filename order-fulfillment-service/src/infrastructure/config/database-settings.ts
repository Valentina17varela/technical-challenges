import type { DatabaseSettings } from '../persistence/typeorm/typeorm.options.js';
import { validateEnvironment } from './env.validation.js';

export function getDatabaseSettingsFromEnvironment(): DatabaseSettings {
  const config = validateEnvironment(process.env);

  return {
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: config.NODE_ENV !== 'production',
  };
}
