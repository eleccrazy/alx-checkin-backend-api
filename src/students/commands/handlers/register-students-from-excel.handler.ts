import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterStudentFromExcelCommand } from '../implementation/register-students-from-excel.command';
import { StudentsCommandService } from 'src/students/services/students-command.service';
import { BadRequestException } from '@nestjs/common';
import { ProgramsQueryService } from 'src/programs/services/programs-query.service';
import { CohortsQueryService } from 'src/cohorts/services/cohorts-query.service';

@CommandHandler(RegisterStudentFromExcelCommand)
export class RegisterStudentFromExcelHandler
  implements ICommandHandler<RegisterStudentFromExcelCommand>
{
  constructor(
    private readonly studentsCommandService: StudentsCommandService,
    private readonly programService: ProgramsQueryService,
    private readonly cohortService: CohortsQueryService,
  ) {}
  async execute(command: RegisterStudentFromExcelCommand): Promise<any> {
    try {
      const { filePath, programId, cohortId, isAlumni } = command;
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
      const result =
        await this.studentsCommandService.registerStudentsFromExcel(
          filePath,
          program,
          cohort,
          isAlumni,
        );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
