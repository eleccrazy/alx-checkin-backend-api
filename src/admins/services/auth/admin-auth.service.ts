import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity, Role } from 'src/entities/admins.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  IAdminAuthService,
  CreateAdminInterface,
  AdminResponseWithTokenType,
} from 'src/admins/interfaces/admins.interface';
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { AdminQueryService } from '../admin-query.service';
import { HubsQueryService } from 'src/hubs/services/hubs-query.service';

// Define message for common not found errors
const INVALID_CREDENTIALS = 'Invalid Credentials';

@Injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
    private readonly configService: ConfigService,
    private readonly adminQueryService: AdminQueryService,
    private readonly hubService: HubsQueryService,
  ) {}
  async signUpAdmin(
    payload: CreateAdminInterface,
  ): Promise<AdminResponseWithTokenType> {
    try {
      // Check if email exists
      const existsingAdmin = await this.adminQueryService.getAdminByEmail(
        payload.email,
      );
      if (existsingAdmin) {
        throw new BadRequestException('Email exists');
      }
      // Check the complexity of the password
      if (!validator.isStrongPassword(payload.password)) {
        // Return an error
        throw new BadRequestException('Password is not strong enough');
      }
      const papper = this.configService.get<string>('PAPPER');
      const saltRounds = this.configService.get<string>('SALT_ROUNDS');
      const passwordDigest = await bcrypt.hash(
        (payload.password as unknown as string) + papper,
        Number(saltRounds),
      );
      // Create a new admin object and save it to the database.
      const admin = new AdminEntity();
      admin.firstName = payload.firstName;
      admin.lastName = payload.lastName;
      admin.role = payload.role;
      admin.email = payload.email;
      admin.password = passwordDigest;
      // Check if hub exists and update the admin if the role of the admin is attendant
      if (payload.hubId && payload.role === 'attendant') {
        const hub = await this.hubService.getSingleHub(payload.hubId);
        // update admin
        admin.hub = hub;
      }

      const newAdmin = await this.adminRepository.save(admin);
      // Create a token.
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      let token = jwt.sign(
        { id: newAdmin.id, email: newAdmin.email, role: newAdmin.role },
        jwtSecret,
      );
      // Remove the password from the admin object
      const { password, ...adminWithoutPassword } = newAdmin;

      // Return the admin
      return { token: token, admin: adminWithoutPassword };
    } catch (error) {
      // Check if the type of error is BadRequestException
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  // Login admin
  async loginAdmin(data: {
    email: string;
    password: string;
  }): Promise<AdminResponseWithTokenType> {
    try {
      // Check if the admin exists
      const admin = await this.adminRepository.findOne({
        where: { email: data.email },
        relations: ['hub'],
      });
      if (!admin) {
        throw new BadRequestException(INVALID_CREDENTIALS);
      }
      // Check if the password is correct
      const papper = this.configService.get<string>('PAPPER');
      const isPasswordCorrect = await bcrypt.compare(
        data.password + papper,
        admin.password,
      );
      if (!isPasswordCorrect) {
        throw new BadRequestException(INVALID_CREDENTIALS);
      }
      // Generate a token
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      let token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        jwtSecret,
      );
      // Delete password from the admin object
      const { password, ...adminWithoutPassword } = admin;
      return { token, admin: adminWithoutPassword };
    } catch (error) {
      // Check if the type of error is BadRequestException
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
