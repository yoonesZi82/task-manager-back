import { IsOptional, IsEnum, Min, IsPositive, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import taskStatusEnum from '../enums/taskStatusEnum';

export class TaskQueryDto {
  @IsOptional()
  @IsEnum(taskStatusEnum, {
    message:
      'Status must be one of the following: cancelled, completed, pending, setup',
  })
  status?: taskStatusEnum;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  project?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 8;
}
