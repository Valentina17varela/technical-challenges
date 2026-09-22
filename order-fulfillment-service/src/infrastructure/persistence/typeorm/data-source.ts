import 'dotenv/config';
import { DataSource } from 'typeorm';
import { createTypeOrmOptions } from './typeorm.options.js';

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const dataSource = new DataSource(
  createTypeOrmOptions({
    host: getRequiredEnvironmentVariable('DB_HOST'),
    port: Number(getRequiredEnvironmentVariable('DB_PORT')),
    username: getRequiredEnvironmentVariable('DB_USERNAME'),
    password: getRequiredEnvironmentVariable('DB_PASSWORD'),
    database: getRequiredEnvironmentVariable('DB_NAME'),
  }),
);

export default dataSource;