import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ProgramEntity } from './programs.entity';
import { CohortEntity } from './cohorts.entity';
import { HubEntity } from './hubs.entity';
import { AttendanceEntity } from './attendances.entity';

// Custom enum for Gender
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Other,
  })
  gender: Gender;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ default: false })
  isAlumni: boolean;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  qrLocalPath: string;

  @Column({ nullable: true })
  qrRemotePath: string;

  @ManyToOne(() => ProgramEntity, (program) => program.students)
  program: ProgramEntity;

  @OneToMany(() => ProgramEntity, (program) => program.student)
  prevPrograms: ProgramEntity[];

  @OneToMany(() => AttendanceEntity, (attendance) => attendance.student)
  attendances: AttendanceEntity[];

  @ManyToOne(() => HubEntity, (hub) => hub.students, { nullable: true })
  hub: HubEntity;

  @ManyToOne(() => CohortEntity, (cohort) => cohort.students)
  cohort: CohortEntity;
}
