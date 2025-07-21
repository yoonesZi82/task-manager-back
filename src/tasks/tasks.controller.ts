import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Response } from 'express';
import { TaskQueryDto } from './dto/task-query.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Res() res: Response, @Body() createTaskDto: CreateTaskDto) {
    const newTask = await this.tasksService.create(createTaskDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'Task created successfully',
      data: newTask,
    });
  }

  @Get()
  async findAll(@Res() res: Response, @Query() taskQueryDto: TaskQueryDto) {
    const tasks = await this.tasksService.findAll(
      taskQueryDto.status,
      taskQueryDto.project,
      taskQueryDto.page,
      taskQueryDto.limit,
    );

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Tasks fetched successfully',
      data: tasks,
    });
  }

  @Get(':id')
  async findById(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const task = await this.tasksService.findById(id);

    if (!task) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Task with ID ${id} not found.`,
        error: 'Not Found',
      });
    }

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Task fetched successfully',
      data: task,
    });
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    await this.tasksService.update(id, updateTaskDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Task updated successfully',
      data: null,
    });
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    await this.tasksService.remove(id);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Task deleted successfully',
      data: null,
    });
  }
}
