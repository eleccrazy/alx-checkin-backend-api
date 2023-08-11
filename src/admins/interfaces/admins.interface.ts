import { AdminEntity } from 'src/entities/admins.entity';
import { Role } from 'src/entities/admins.entity';

// Interface to be implemented in the admin service class
export interface IAdminsService {
  getAdmins(): Promise<AdminEntity[]>;
  createAdmin(
    payload: CreateAdminInterface,
  ): Promise<AdminResponseWithTokenType>;
  updateAdmin(
    id: string,
    payload: UpdateAdminInterface,
  ): Promise<AdminResponseType>;
  deleteAdmin(id: string): Promise<{ message: string }>;
  getAdminByEmail(email: string): Promise<AdminEntity>;
  getAdminById(id: string): Promise<AdminResponseType>;
  promoteAdmin(id: string, role: Role): Promise<AdminResponseType>;
}

// Interface for typing the create admin object (payload)
export interface CreateAdminInterface {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role?: Role;
}

// Interface for typing the update admin object (payload)
export interface UpdateAdminInterface {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
}

// Interface for typing the change password object (payload)
export interface ChangePasswordInterface {
  oldPassword?: string;
  newPassword?: string;
}

// Interface for typing the admin response object
export type AdminResponseWithTokenType = {
  token: string;
  admin: AdminResponseType;
};

// Interface for typing the admin response object without token
export type AdminResponseType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};
