import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Double,
} from 'typeorm';
import { StudentEntity } from './students.entity';
import { HubEntity } from './hubs.entity';

// Define the entity for attendanaces table
@Entity('attendances')
export class AttendanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  checkInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutTime: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalTimeSpent: number;

  @Column({ nullable: true })
  day: string;

  @Column({ nullable: true })
  month: number;

  @Column({ nullable: true })
  year: number;

  @ManyToOne(() => StudentEntity, (student) => student.attendances, {
    nullable: false,
  })
  student: StudentEntity;

  @ManyToOne(() => HubEntity, (hub) => hub.attendances, { nullable: true })
  hub: HubEntity;
}
