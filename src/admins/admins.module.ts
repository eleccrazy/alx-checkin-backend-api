import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminsService } from './services/admins.service';
import { AdminsController } from './controllers/admins.controller';
import { GetAllAdminsHandler } from './queries/handlers/get-all-admins.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/entities/admins.entity';
import { CreateAdminHandler } from './commands/handlers/create-admin.handler';
import { GetSingleAdminHandler } from './queries/handlers/get-single-admin.handler';
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
    AdminsService,
    GetAllAdminsHandler,
    CreateAdminHandler,
    GetSingleAdminHandler,
    DeleteAdminHandler,
    UpdateAdminHandler,
    PromoteAdminHandler,
    ChangePasswordHandler,
    LoginCommandHandler,
  ],
  controllers: [AdminsController],
})
export class AdminsModule {}
