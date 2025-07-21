import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import taskStatusEnum from '../enums/taskStatusEnum';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Task title is required' })
  @IsString({ message: 'Task title must be a string and is can not be number' })
  @MinLength(3, { message: 'Task title must be at least 3 characters long' })
  title: string;

  @IsNotEmpty({ message: 'Task description is required' })
  @IsString({ message: 'Task description must be a string' })
  @MinLength(10, {
    message: 'Task description must be at least 10 characters long',
  })
  description: string;

  @IsEnum(taskStatusEnum, {
    message: `Task status must be a valid status (${taskStatusEnum.PENDING}, ${taskStatusEnum.CANCELLED}, ${taskStatusEnum.COMPLETED} ${taskStatusEnum.SETUP})`,
  })
  @IsOptional()
  status: taskStatusEnum;

  @IsNotEmpty({ message: 'Project ID is required' })
  @IsNumber({}, { message: 'Project ID must be a number' })
  projectId: number;
}
