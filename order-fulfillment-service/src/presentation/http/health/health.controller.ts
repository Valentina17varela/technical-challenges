import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({
    description: 'Service health status',
    schema: { example: { status: 'ok', database: 'up' } },
  })
  getStatus(): Promise<{ status: string; database: string }> {
    return this.healthService.getStatus();
  }
}
