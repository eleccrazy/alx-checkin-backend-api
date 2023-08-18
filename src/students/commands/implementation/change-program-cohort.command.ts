export class ChangeProgramCohortCommand {
  constructor(
    public readonly id: string,
    public readonly programId?: string,
    public readonly cohortId?: string,
  ) {}
}
