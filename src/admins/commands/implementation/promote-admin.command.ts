import { Role } from 'src/entities/admins.entity';

export class PromoteAdminCommand {
  constructor(public readonly id: string, public readonly role: Role) {}
}
