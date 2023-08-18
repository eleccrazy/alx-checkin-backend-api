import { Gender } from 'src/entities/students.entity';
export class RegisterStudentCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly programId: string,
    public readonly cohortId: string,
    public readonly gender: Gender,
    public readonly hubId?: string,
    public readonly area?: string,
    public readonly city?: string,
    public readonly isAlumni?: boolean,
  ) {}
}
