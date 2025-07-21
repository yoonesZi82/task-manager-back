import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import projectStatusEnum from '../enums/projectStatusEnum';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'Project name is required' })
  @IsString({
    message: 'Project name must be a string and is can not be number',
  })
  name: string;

  @IsEnum(projectStatusEnum, {
    message: `Project status must be a valid status (${projectStatusEnum.ENABLED}, ${projectStatusEnum.DISABLED})`,
  })
  @IsOptional()
  status: projectStatusEnum;
}
