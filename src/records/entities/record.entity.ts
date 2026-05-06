import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsDateString,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Patient } from '../../patients/entities/patient.entity';

@Entity({ name: 'records' })
export class Record extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({ type: 'date' })
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @Column({ length: 500, nullable: true })
  @IsOptional()
  @ApiProperty({ nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  @IsBoolean()
  isEmergency: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  surchargePercent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  surchargeAmount: number;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => Category, (category) => category.records)
  @ApiProperty({ type: () => Category })
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Patient, (patient) => patient.records)
  @ApiProperty({ type: () => Patient })
  @JoinColumn()
  patient: Patient;

  @Column({ nullable: true })
  @ApiProperty({ nullable: true })
  patientId: number;

  constructor(partial: Partial<Record>) {
    super();
    Object.assign(this, partial);
  }
}
