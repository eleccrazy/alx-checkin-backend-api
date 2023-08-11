import { Injectable } from '@nestjs/common';
import { IAdminCommandService } from '../interfaces/admins.interface';
import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import {
  AdminResponseType,
  UpdateAdminInterface,
} from '../interfaces/admins.interface';
import { QueryFailedError } from 'typeorm';
import { Role } from 'src/entities/admins.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/entities/admins.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import validator from 'validator';
import * as bcrypt from 'bcrypt';
import { AdminQueryService } from '../services/admin-query.service';

const NOT_FOUND_MESSAGE = 'Admin Not Found!';

@Injectable()
export class AdminCommandService implements IAdminCommandService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
    private readonly configService: ConfigService,
    private readonly adminQueryService: AdminQueryService,
  ) {}

  // Update admin
  async updateAdmin(
    id: string,
    payload: UpdateAdminInterface,
  ): Promise<AdminResponseType> {
    try {
      // Check if the admin exists
      const admin = await this.adminQueryService.getAdminById(id);
      // Get the data from the payload
      const { firstName, lastName, email } = payload;
      // Variable to check if there is a value to be get updated
      let isTherePropertyToUpdate = false;
      // Check if we have email in the payload
      if (payload.email) {
        // Check if the email is an existing email
        const existingAdmin = await this.adminQueryService.getAdminByEmail(
          payload.email,
        );
        if (existingAdmin && existingAdmin.email !== admin.email) {
          throw new BadRequestException('Email exists');
        }
        // Check if the email is same as the existing email
        if (admin.email !== payload.email) {
          admin.email = payload.email;
          isTherePropertyToUpdate = true;
        }
      }
      // Check if we have firstName in the payload
      if (payload.firstName) {
        // Check if the firstName is same as the existing firstName
        if (admin.firstName !== payload.firstName) {
          admin.firstName = payload.firstName;
          isTherePropertyToUpdate = true;
        }
      }
      // Check if we have lastName in the payload
      if (payload.lastName) {
        // Check if the lastName is same as the existing lastName
        if (admin.lastName !== payload.lastName) {
          admin.lastName = payload.lastName;
          isTherePropertyToUpdate = true;
        }
      }

      // If we do have nothing to update, we send a bad request response to the client
      if (!isTherePropertyToUpdate) {
        throw new BadRequestException(
          'Nothing to update, you should specify at least one property for updating',
        );
      }

      // Reflect the changes to the database
      admin.updatedAt = new Date();
      const updatedAdmin = await this.adminRepository.save(admin);
      return updatedAdmin;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  // Delete admin
  async deleteAdmin(id: string): Promise<{ message: string }> {
    try {
      // Delete the admin if it is find with the provided id.
      const result = await this.adminRepository.delete(id);
      // If the admin with the provided id is not found, send a bad request 400 response to the client
      if (result.affected === 0) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      // If the position deletion is successfull, send the appropriate message to the client.
      return { message: 'Admin Deleted Successfully!' };
    } catch (error) {
      // Check if the error is Not found error
      if (error instanceof NotFoundException) {
        throw error;
      }
      // Check if the QueryFailedError is thrown and is caused by invalid uuid
      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  // Promote admin to attendat and viceversa
  async promoteAdmin(id: string, role: Role): Promise<AdminResponseType> {
    try {
      // Check if the admin exists
      const admin = await this.adminQueryService.getAdminById(id);
      if (!admin) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      // Check if the role is same as the existing role
      if (admin.role !== role) {
        admin.role = role;
      } else {
        throw new BadRequestException(
          'Admin already has the role you are trying to promote him/her to',
        );
      }
      // Reflect the changes to the database
      admin.updatedAt = new Date();
      const updatedAdmin = await this.adminRepository.save(admin);
      // Delete password from the admin object
      const { password, ...adminWithoutPassword } = updatedAdmin;
      return adminWithoutPassword;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  // Change password
  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<AdminResponseType> {
    try {
      // Check if the admin exists
      const admin = await this.adminRepository.findOneBy({ id: id });
      if (!admin) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      // Check if the old password is correct
      const papper = this.configService.get<string>('PAPPER');
      const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword + papper,
        admin.password,
      );
      if (!isOldPasswordCorrect) {
        throw new BadRequestException('Old password is incorrect');
      }
      // Check the complexity of the password
      if (!validator.isStrongPassword(newPassword)) {
        // Return an error
        throw new BadRequestException('Password is not strong enough');
      }
      // Hash the new password
      const saltRounds = this.configService.get<string>('SALT_ROUNDS');
      const passwordDigest = await bcrypt.hash(
        newPassword + papper,
        Number(saltRounds),
      );
      // Update the password
      admin.password = passwordDigest;
      // Reflect the changes to the database
      admin.updatedAt = new Date();
      const updatedAdmin = await this.adminRepository.save(admin);
      // Delete password from the admin object
      const { password, ...adminWithoutPassword } = updatedAdmin;
      return adminWithoutPassword;
    } catch (error) {
      // Check if the error is Not found error
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // Check if the QueryFailedError is thrown and is caused by invalid uuid
      if (
        error instanceof QueryFailedError &&
        error.message.includes('invalid input syntax for type uuid')
      ) {
        throw new NotFoundException(NOT_FOUND_MESSAGE);
      }
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
