import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

@Entity({ name: 'audit_logs' })
export class AuditLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'enum', enum: AuditAction })
  @ApiProperty({ enum: AuditAction })
  action: AuditAction;

  @Column()
  @ApiProperty()
  recordId: number;

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  userId: number;

  @Column({ type: 'simple-json', nullable: true })
  @ApiProperty({ nullable: true })
  before: unknown;

  @Column({ type: 'simple-json', nullable: true })
  @ApiProperty({ nullable: true })
  after: unknown;

  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  createdAt: Date;
}
