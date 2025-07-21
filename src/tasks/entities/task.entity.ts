import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import taskStatusEnum from '../enums/taskStatusEnum';
import { Project } from '@/projects/entities/project.entity';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    default: taskStatusEnum.SETUP,
    enum: taskStatusEnum,
  })
  status: taskStatusEnum;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
