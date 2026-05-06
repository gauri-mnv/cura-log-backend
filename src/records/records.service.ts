import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { Repository } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Category } from '../categories/entities/category.entity';
import { AuditAction, AuditLog } from './entities/audit-log.entity';

const EMERGENCY_SURCHARGE_PERCENT = 15;
const REGISTRATION_CATEGORY_NAME = 'Registration';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  applyEmergencySurcharge(price: number, isEmergency = false, percent?: number) {
    const surchargePercent = isEmergency
      ? percent ?? EMERGENCY_SURCHARGE_PERCENT
      : 0;
    const surchargeAmount = Number(
      ((Number(price) * Number(surchargePercent)) / 100).toFixed(2),
    );

    return {
      price: Number((Number(price) + surchargeAmount).toFixed(2)),
      surchargePercent,
      surchargeAmount,
    };
  }

  removeExistingSurcharge(price: number, record: Record) {
    if (!record.isEmergency || !record.surchargeAmount) {
      return Number(price);
    }

    return Number((Number(price) - Number(record.surchargeAmount)).toFixed(2));
  }

  async create(createRecordDto: CreateRecordDto, userId?: number) {
    const surcharge = this.applyEmergencySurcharge(
      createRecordDto.price,
      createRecordDto.isEmergency,
      createRecordDto.surchargePercent,
    );
    const record = await this.recordRepository.create({
      price: surcharge.price,
      notes: createRecordDto.notes,
      patient: createRecordDto.patient,
      category: createRecordDto.category,
      date: createRecordDto.date,
      isEmergency: createRecordDto.isEmergency ?? false,
      surchargePercent: surcharge.surchargePercent,
      surchargeAmount: surcharge.surchargeAmount,
    });

    const savedRecord = await this.recordRepository.save(record);
    await this.writeAuditLog(AuditAction.CREATE, savedRecord.id, userId, null, savedRecord);

    return savedRecord;
  }

  async findAll(patient: Patient) {
    const query = this.recordRepository
      .createQueryBuilder('record')
      .leftJoin('record.patient', 'patient')
      .leftJoinAndSelect('record.category', 'category')
      .where('patient.id = :id', { id: patient.id })
      .orderBy('record.id', 'DESC')
      .limit(6);

    return await query.getMany();
  }

  async findOne(id: number) {
    return await this.recordRepository.findOne({
      relations: { category: true, patient: true },
      where: { id },
    });
  }

  async update(id: number, updateRecordDto: UpdateRecordDto, userId?: number) {
    const existingRecord = await this.findOne(id);

    if (!existingRecord) {
      throw new BadRequestException('Record does not exist.');
    }

    if (existingRecord?.category?.name === REGISTRATION_CATEGORY_NAME) {
      throw new BadRequestException(
        'Registration fees cannot be edited after creation.',
      );
    }

    const surcharge = this.applyEmergencySurcharge(
      this.removeExistingSurcharge(
        updateRecordDto.price ?? existingRecord.price,
        existingRecord,
      ),
      updateRecordDto.isEmergency ?? existingRecord.isEmergency,
      updateRecordDto.surchargePercent ?? existingRecord.surchargePercent,
    );
    const updatedRecord = await this.recordRepository.save({
      id: id,
      price: surcharge.price,
      notes: updateRecordDto.notes ?? existingRecord.notes,
      date: updateRecordDto.date ?? existingRecord.date,
      patient: updateRecordDto.patient ?? existingRecord.patient,
      category: updateRecordDto.category ?? existingRecord.category,
      isEmergency: updateRecordDto.isEmergency ?? existingRecord.isEmergency,
      surchargePercent: surcharge.surchargePercent,
      surchargeAmount: surcharge.surchargeAmount,
    });

    await this.writeAuditLog(
      AuditAction.UPDATE,
      id,
      userId,
      existingRecord,
      updatedRecord,
    );

    return updatedRecord;
  }

  async remove(id: number, userId?: number) {
    const existingRecord = await this.findOne(id);
    const result = await this.recordRepository.softDelete(id);
    await this.writeAuditLog(AuditAction.DELETE, id, userId, existingRecord, null);

    return result;
  }

  async getRemarks(category: Category) {
    return await this.recordRepository.find({
      relations: { category: true },
      where: {
        category: {
          id: category.id,
        },
      },
    });
  }

  async getNotes(category: Category) {
    return await this.getRemarks(category);
  }

  private async writeAuditLog(
    action: AuditAction,
    recordId: number,
    userId: number | undefined,
    before: Record | null,
    after: Record | null,
  ) {
    return await this.auditLogRepository.save({
      action,
      recordId,
      userId,
      before,
      after,
    });
  }
}
