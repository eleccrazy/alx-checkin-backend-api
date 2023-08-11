import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { StudentEntity } from './students.entity';
import { CohortEntity } from './cohorts.entity';

// Define the entity for programs table
@Entity('programs')
export class ProgramEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true })
  cohortInfo: string;

  @OneToMany(() => StudentEntity, (student) => student.program)
  students: StudentEntity[];

  @ManyToOne(() => StudentEntity, (student) => student.prevPrograms)
  student: ProgramEntity;

  @OneToMany(() => CohortEntity, (cohort) => cohort.program)
  cohorts: CohortEntity[];
}
