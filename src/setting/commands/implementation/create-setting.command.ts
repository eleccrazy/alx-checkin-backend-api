export class CreateSettingCommand {
  constructor(
    public readonly sourceEmail?: string,
    public readonly password?: string,
    public readonly subject?: string,
    public readonly content?: string,
    public readonly timeLimit?: number,
  ) {}
}
