import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

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
          statusCode: 409,
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

  findAll() {
    return `This action returns all projects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    console.log(updateProjectDto);
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
