import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
    ],
    example: 'No warehouse has enough inventory to fulfill the complete order',
  })
  message: string | string[];

  @ApiProperty({ example: 'Conflict' })
  error: string;
}