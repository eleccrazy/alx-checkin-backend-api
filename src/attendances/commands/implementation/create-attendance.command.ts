export class CreateAttendanceCommand {
  constructor(
    public readonly studentId: string,
    public readonly hubId: string,
  ) {}
}
