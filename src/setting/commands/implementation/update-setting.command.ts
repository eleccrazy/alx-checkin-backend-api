export class UpdateSettingCommand {
  constructor(
    public readonly id: string,
    public readonly sourceEmail?: string,
    public readonly password?: string,
    public readonly subject?: string,
    public readonly content?: string,
    public readonly host?: string,
    public readonly port?: number,
    public readonly timeLimit?: number,
  ) {}
}
