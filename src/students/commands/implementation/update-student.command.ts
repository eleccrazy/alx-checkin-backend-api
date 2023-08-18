import { Gender } from 'src/entities/students.entity';
export class UpdateStudentCommand {
  constructor(
    public readonly id: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly gender?: Gender,
    public readonly hubId?: string,
    public readonly area?: string,
    public readonly city?: string,
  ) {}
}
