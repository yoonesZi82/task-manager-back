import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import projectStatusEnum from '../enums/projectStatusEnum';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(projectStatusEnum)
  @IsNotEmpty()
  status: projectStatusEnum;
}
