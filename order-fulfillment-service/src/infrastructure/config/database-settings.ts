import type { DatabaseSettings } from '../persistence/typeorm/typeorm.options.js';

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getDatabaseSettingsFromEnvironment(): DatabaseSettings {
  const port = Number(getRequiredEnvironmentVariable('DB_PORT'));

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('DB_PORT must be a valid TCP port');
  }

  return {
    host: getRequiredEnvironmentVariable('DB_HOST'),
    port,
    username: getRequiredEnvironmentVariable('DB_USERNAME'),
    password: getRequiredEnvironmentVariable('DB_PASSWORD'),
    database: getRequiredEnvironmentVariable('DB_NAME'),
  };
}
