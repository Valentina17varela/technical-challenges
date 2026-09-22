import 'dotenv/config';
import { DataSource } from 'typeorm';
import { getDatabaseSettingsFromEnvironment } from '../../config/database-settings.js';
import { createTypeOrmOptions } from './typeorm.options.js';

const dataSource = new DataSource(
  createTypeOrmOptions(getDatabaseSettingsFromEnvironment()),
);

export default dataSource;
