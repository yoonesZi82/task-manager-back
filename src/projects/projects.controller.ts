import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Put,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import projectStatusEnum from './enums/projectStatusEnum';
import { Response } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Res() res: Response,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    const newProject = await this.projectsService.create(createProjectDto);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'Project created successfully',
      data: newProject,
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('status') status?: projectStatusEnum,
    @Query('limit') limit: number = 8,
    @Query('page') page: number = 1,
  ) {
    const projects = await this.projectsService.findAll(
      status || undefined,
      page,
      limit,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Projects fetched successfully',
      data: projects,
    });
  }

  @Get(':id')
  async findById(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const project = await this.projectsService.findById(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Project fetched successfully',
      data: project,
    });
  }

  @Put(':id')
  async update(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    await this.projectsService.update(id, updateProjectDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
      data: null,
    });
  }

  @Delete(':id')
  async remove(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    await this.projectsService.remove(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Project deleted successfully',
      data: null,
    });
  }
}
