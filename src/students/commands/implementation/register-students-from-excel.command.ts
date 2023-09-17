export class RegisterStudentFromExcelCommand {
  constructor(
    public readonly filePath: string,
    public readonly programId: string,
    public readonly cohortId: string,
    public readonly isAlumni: string,
  ) {}
}
