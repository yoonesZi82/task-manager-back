import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import projectStatusEnum from './enums/projectStatusEnum';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const { name } = createProjectDto;

    const existingProject = await this.projectRepository.findOne({
      where: { name },
    });

    if (existingProject) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: `Project name "${name}" already exists.`,
          error: 'Conflict',
        },
        HttpStatus.CONFLICT,
      );
    }

    try {
      const newProject = this.projectRepository.create(createProjectDto);
      await this.projectRepository.save(newProject);
      return {
        message: 'Project created successfully',
        newProject,
      };
    } catch (err: any) {
      throw new BadRequestException({
        statusCode: 500,
        message: 'Error in creating project',
        error: err.message,
      });
    }
  }

  async findAll(
    status?: projectStatusEnum,
    page: number = 1,
    limit: number = 8,
  ) {
    const query = this.projectRepository
      .createQueryBuilder('project')
      .orderBy('project.createdAt', 'DESC');

    if (status) {
      query.where('project.status = :status', { status }); // :status is a dynamic parameter
    }

    query.skip((page - 1) * limit).take(limit);

    try {
      const projects = await query.getMany();

      return {
        message: 'Projects fetched successfully',
        projects,
      };
    } catch (err: any) {
      throw new BadRequestException({
        statusCode: 500,
        message: 'Error in fetching projects',
        error: err.message,
      });
    }
  }

  async findById(id: number) {
    try {
      const project = await this.projectRepository.findOneBy({ id });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return {
        message: 'Project fetched successfully',
        project,
      };
    } catch (err: any) {
      if (err instanceof HttpException || err instanceof NotFoundException) {
        throw err;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'Error in fetching project by id',
        error: err.message,
      });
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.projectRepository.findOneBy({ id });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      await this.projectRepository.update(id, updateProjectDto);

      return {
        message: `${project.name} project updated successfully`,
      };
    } catch (err: any) {
      if (err instanceof HttpException || err instanceof NotFoundException) {
        throw err;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'Error in updating project',
        error: err.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const project = await this.projectRepository.findOneBy({ id });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      await this.projectRepository.delete(id);

      return {
        message: `${project.name} project deleted successfully`,
      };
    } catch (err: any) {
      if (err instanceof HttpException || err instanceof NotFoundException) {
        throw err;
      }

      throw new BadRequestException({
        statusCode: 500,
        message: 'Error in deleting project',
        error: err.message,
      });
    }
  }
}
