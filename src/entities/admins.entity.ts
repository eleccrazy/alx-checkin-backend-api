import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { HubEntity } from './hubs.entity';

// Custom enum for roles
export enum Role {
  Admin = 'admin',
  Attendant = 'attendant',
}

// Define the entity for admins table
@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.Attendant })
  role: Role;

  @ManyToOne(() => HubEntity, (hub) => hub.attendances, { nullable: true })
  hub: HubEntity;
}
