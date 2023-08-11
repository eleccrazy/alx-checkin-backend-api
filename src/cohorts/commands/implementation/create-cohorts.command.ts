export class CreateCohortCommand {
  constructor(
    public readonly name: string,
    public readonly programId: string,
  ) {}
}
