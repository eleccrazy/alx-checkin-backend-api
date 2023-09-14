import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Define the entity for settings table
@Entity('settings')
export class SettingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  sourceEmail: string;

  @Column({ nullable: true })
  host: string;

  @Column({ nullable: true })
  port: number;

  @Column()
  password: string;

  @Column()
  subject: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  timeLimit: number;
}
