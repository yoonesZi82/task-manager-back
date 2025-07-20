import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import projectStatusEnum from '../enums/projectStatusEnum';
import { Task } from '@/tasks/entities/task.entity';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    default: projectStatusEnum.ENABLED,
    enum: projectStatusEnum,
  })
  status: projectStatusEnum;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
