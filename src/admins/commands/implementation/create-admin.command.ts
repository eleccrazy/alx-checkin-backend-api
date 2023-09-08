import { Role } from 'src/entities/admins.entity';
export class CreateAdminCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role,
    public readonly confirmPassword: string,
    public readonly hubId?: string,
  ) {}
}
