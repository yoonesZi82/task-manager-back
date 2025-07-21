import { IsOptional, IsEnum, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import projectStatusEnum from '../enums/projectStatusEnum';

export class ProjectQueryDto {
  @IsOptional()
  @IsEnum(projectStatusEnum, {
    message: 'Status must be one of the following: enabled, disabled',
  })
  status?: projectStatusEnum;

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
