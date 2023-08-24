import {
  Controller,
  Get,
  Body,
  Param,
  Post,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import {
  RegisterAdminDto,
  UpdateAdminDto,
  PromoteAdminDto,
  ChangePasswordDto,
  LoginAdminDto,
} from '../dtos/admins.dtos';
import { CreateAdminCommand } from '../commands/implementation/create-admin.command';
import { ValidationPipe, UsePipes } from '@nestjs/common';
import { GetAllAdminsQuery } from '../queries/implementation/get-all-admins.query';
import { DeleteAdminCommand } from '../commands/implementation/delete-admin.command';
import { GetSingleAdminQuery } from '../queries/implementation/get-single-admin.query';
import { UpdateAdminCommand } from '../commands/implementation/update-admin.command';
import { PromoteAdminCommand } from '../commands/implementation/promote-admin.command';
import { ChangePasswordCommand } from '../commands/implementation/change-password.comand';
import { LoginCommand } from '../commands/implementation/login-admin.command';

@Controller('admins')
@ApiTags('Documentation for admins route')
export class AdminsController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}
  // Get all admins
  @Get()
  @ApiOperation({ summary: 'Get all admins from the database' })
  async getAdmins() {
    return await this.queryBus.execute(new GetAllAdminsQuery());
  }

  // Register a new admin
  @Post('register')
  @ApiOperation({ summary: 'Register a new admin' })
  @UsePipes(ValidationPipe)
  async createAdmin(@Body() payload: RegisterAdminDto) {
    const command = new CreateAdminCommand(
      payload.firstName,
      payload.lastName,
      payload.email,
      payload.password,
      payload.role,
      payload.confirmPassword,
    );
    const result = await this.commandBus.execute(command);
    return result;
  }

  // Login admin
  @Post('login')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Login admin' })
  async loginAdmin(@Body() payload: LoginAdminDto) {
    return await this.commandBus.execute(
      new LoginCommand(payload.email, payload.password),
    );
  }

  // Get a single admin
  @Get(':id')
  @ApiOperation({ summary: 'Get a single admin based on its id' })
  async getAdmin(@Param('id') id: string) {
    return await this.queryBus.execute(new GetSingleAdminQuery(id));
  }

  // Update a single admin
  @Patch(':id')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Update a single admin based on its id' })
  async updateAdmin(@Param('id') id: string, @Body() payload: UpdateAdminDto) {
    return await this.commandBus.execute(
      new UpdateAdminCommand(
        id,
        payload.firstName,
        payload.lastName,
        payload.email,
      ),
    );
  }

  // Promote admin from attendant to Admin privilege and vice versa
  @Patch(':id/role')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Promote admin from attendant to Admin privilege and vice versa',
  })
  async promoteToAdmin(
    @Param('id') id: string,
    @Body() payload: PromoteAdminDto,
  ) {
    return await this.commandBus.execute(
      new PromoteAdminCommand(id, payload.role),
    );
  }

  // Delete admin based on its id.
  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin based on its id' })
  async deleteAdmin(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteAdminCommand(id));
  }

  // Change admin password
  @Patch(':id/password')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Change admin password' })
  async changeAdminPassword(
    @Param('id') id: string,
    @Body() payload: ChangePasswordDto,
  ) {
    return await this.commandBus.execute(
      new ChangePasswordCommand(
        id,
        payload.oldPassword,
        payload.newPassword,
        payload.confirmPassword,
      ),
    );
  }
}
