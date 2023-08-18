import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import all entities and controllers associated with admins
import { AdminEntity } from 'src/entities/admins.entity';
import { AdminsController } from './controllers/admins.controller';

// Import all service classes associated with admins
import { AdminAuthService } from './services/auth/admin-auth.service';
import { AdminCommandService } from './services/admin-command.service';
import { AdminQueryService } from './services/admin-query.service';

// Import all handler classes associated with admins
import { CreateAdminHandler } from './commands/handlers/create-admin.handler';
import { GetSingleAdminHandler } from './queries/handlers/get-single-admin.handler';
import { GetAllAdminsHandler } from './queries/handlers/get-all-admins.handler';
import { DeleteAdminHandler } from './commands/handlers/delete-admin.handler';
import { UpdateAdminHandler } from './commands/handlers/update-admin.handler';
import { PromoteAdminHandler } from './commands/handlers/promote-admin.handler';
import { ChangePasswordHandler } from './commands/handlers/change-password.handler';
import { LoginCommandHandler } from './commands/handlers/login-admin.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          PAPPER: process.env.PAPPER,
          SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS, 10),
          JWT_SECRET: process.env.JWT_SECRET,
        }),
      ],
    }),
  ],
  providers: [
    GetAllAdminsHandler,
    CreateAdminHandler,
    GetSingleAdminHandler,
    DeleteAdminHandler,
    UpdateAdminHandler,
    PromoteAdminHandler,
    ChangePasswordHandler,
    LoginCommandHandler,
    AdminAuthService,
    AdminCommandService,
    AdminQueryService,
  ],
  controllers: [AdminsController],
})
export class AdminsModule {}
