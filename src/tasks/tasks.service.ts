import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { Project } from '@/projects/entities/project.entity';
import taskStatusEnum from './enums/taskStatusEnum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const { title } = createTaskDto;

    const existingTask = await this.taskRepository.findOne({
      where: { title },
    });

    if (existingTask) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: `Task title "${title}" already exists.`,
          error: 'Conflict',
        },
        HttpStatus.CONFLICT,
      );
    }

    try {
      const { projectId, ...taskData } = createTaskDto;

      const project = await this.projectRepository.findOneBy({ id: projectId });

      if (!project) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Project with ID ${projectId} not found.`,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const newTask = this.taskRepository.create({
        ...taskData,
        project,
      });
      await this.taskRepository.save(newTask);
      return newTask;
    } catch (err: any) {
      if (err instanceof HttpException || err instanceof BadRequestException) {
        throw err;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'Error in creating task',
        error: err.message,
      });
    }
  }

  async findAll(
    status?: taskStatusEnum,
    projectId?: number,
    page: number = 1,
    limit: number = 8,
  ) {
    try {
      // const tasks = await this.taskRepository.find({
      //   relations: ['project'],
      //   order: {
      //     createdAt: 'DESC',
      //   },
      // });
      // OR

      const query = this.taskRepository
        .createQueryBuilder('tasks')
        .innerJoinAndSelect('tasks.project', 'project')
        .orderBy('tasks.createdAt', 'DESC');

      if (projectId) {
        query.andWhere('tasks.projectId = :projectId', { projectId });
      }

      if (status) {
        query.andWhere('tasks.status = :status', { status });
      }

      query.skip((page - 1) * limit).take(limit);

      const tasks = await query.getMany();
      return tasks;
    } catch (err: any) {
      if (err instanceof HttpException || err instanceof BadRequestException) {
        throw err;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'Error in fetching tasks',
        error: err.message,
      });
    }
  }

  async findById(id: number) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['project'],
      });

      if (!task) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Task with ID ${id} not found.`,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return task;
    } catch (err: any) {
      if (err instanceof HttpException || err instanceof BadRequestException) {
        throw err;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'Error in fetching task',
        error: err.message,
      });
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['project'],
      });

      if (!task) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Task with ID ${id} not found.`,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.taskRepository.update(id, updateTaskDto);
    } catch (err: any) {
      if (err instanceof HttpException || err instanceof BadRequestException) {
        throw err;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'Error in updating task',
        error: err.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
      });

      if (!task) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Task with ID ${id} not found.`,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.taskRepository.delete(id);
    } catch (err: any) {
      if (err instanceof HttpException || err instanceof BadRequestException) {
        throw err;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'Error in deleting task',
        error: err.message,
      });
    }
  }
}
