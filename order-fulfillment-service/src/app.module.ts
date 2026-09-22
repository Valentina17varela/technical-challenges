import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironment } from './infrastructure/config/env.validation.js';
import { DatabaseModule } from './infrastructure/persistence/typeorm/database.module.js';
import { HealthModule } from './presentation/http/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    DatabaseModule,
    HealthModule,
  ],
})
export class AppModule {}
