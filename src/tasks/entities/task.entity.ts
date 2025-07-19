import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import taskStatusEnum from '../enums/taskStatusEnum';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    default: taskStatusEnum.PENDING,
    enum: taskStatusEnum,
  })
  status: taskStatusEnum;

  @Column({ type: 'bigint' })
  projectId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
