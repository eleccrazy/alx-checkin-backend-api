import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AdminEntity } from 'src/entities/admins.entity';
import { ProgramEntity } from 'src/entities/programs.entity';
import { StudentEntity } from 'src/entities/students.entity';
import { CohortEntity } from 'src/entities/cohorts.entity';
import { HubEntity } from 'src/entities/hubs.entity';
import { AttendanceEntity } from 'src/entities/attendances.entity';

export const typeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    synchronize: true,
    entities: [
      AdminEntity,
      ProgramEntity,
      HubEntity,
      CohortEntity,
      AttendanceEntity,
      StudentEntity,
    ],
  };
};
