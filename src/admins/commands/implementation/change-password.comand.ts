export class ChangePasswordCommand {
  constructor(
    public readonly id: string,
    public readonly oldPassword: string,
    public readonly newPassword: string,
    public readonly confirmPassword: string,
  ) {}
}
