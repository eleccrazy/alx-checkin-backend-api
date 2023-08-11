import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { StudentEntity } from './students.entity';
import { AttendanceEntity } from './attendances.entity';

// Define an entity for hubs table
@Entity('hubs')
export class HubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => StudentEntity, (student) => student.hub)
  students: StudentEntity[];

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.hub)
  attendances: AttendanceEntity[];
}
