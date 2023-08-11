import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProgramEntity } from './programs.entity';
import { StudentEntity } from './students.entity';

// Define an entity for cohorts table
@Entity('cohorts')
export class CohortEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => ProgramEntity, (program) => program.cohorts)
  program: ProgramEntity;

  @OneToMany(() => StudentEntity, (student) => student.cohort)
  students: StudentEntity[];
}
