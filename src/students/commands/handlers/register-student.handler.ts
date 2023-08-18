import { RegisterStudentCommand } from '../implementation/register-student.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StudentEntity } from 'src/entities/students.entity';
import { BadRequestException } from '@nestjs/common';

import { StudentsCommandService } from 'src/students/services/students-command.service';
import { ProgramsQueryService } from 'src/programs/services/programs-query.service';
import { CohortsQueryService } from 'src/cohorts/services/cohorts-query.service';
import { HubsQueryService } from 'src/hubs/services/hubs-query.service';

// Command handler for registering a new student
@CommandHandler(RegisterStudentCommand)
export class RegisterStudentHandler
  implements ICommandHandler<RegisterStudentCommand>
{
  constructor(
    private readonly studentService: StudentsCommandService,
    private readonly programService: ProgramsQueryService,
    private readonly cohortService: CohortsQueryService,
    private readonly hubService: HubsQueryService,
  ) {}
  async execute(command: RegisterStudentCommand): Promise<StudentEntity> {
    try {
      const { hubId, programId, cohortId, ...rest } = command;
      // Check if gender is a valid gender
      if (!['Male', 'Female', 'Other'].includes(command.gender)) {
        throw new BadRequestException(
          'Students gender must be one of the following: Male, Female, Other',
        );
      }

      // Check if the program with the programId exists
      const program = await this.programService.getSingleProgram(
        command.programId,
      );
      if (!program) {
        throw new BadRequestException("Program doesn't exist");
      }

      // Check if the cohort with the cohortId exists
      const cohort = await this.cohortService.getSingleCohort(command.cohortId);
      if (!cohort) {
        throw new BadRequestException("Cohort doesn't exist");
      }

      // Check if the cohort exists in the program
      if (cohort.program.id !== program.id) {
        throw new BadRequestException(
          'Cohort does not exist in the program specified',
        );
      }

      // Check if the hub with the hubId exists
      const hub = await this.hubService.getSingleHub(command.hubId);
      if (command.hubId && !hub) {
        throw new BadRequestException("Hub doesn't exist");
      }

      return await this.studentService.registerStudent({
        ...rest,
        program,
        cohort,
        hub,
      });
    } catch (error) {
      throw error;
    }
  }
}
