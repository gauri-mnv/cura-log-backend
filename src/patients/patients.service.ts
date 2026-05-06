import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto, user: User) {
    const patient = await this.patientRepository.create({
      name: createPatientDto.name,
      currency: createPatientDto.currency,
      user: user,
    });

    return await this.patientRepository.save(patient);
  }

  async findAll(userId: number) {
    const query = this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.records', 'records')
      .leftJoinAndSelect('records.category', 'category')
      .leftJoin('patient.user', 'user')
      .where('user.id = :id', { id: userId });

    return await query.getMany();
  }

  async findOne(id: number): Promise<Patient> {
    const query = await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.records', 'records')
      .where('patient.id = :id', { id });

    return await query.getOne();
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    return await this.patientRepository.save({
      id: id,
      name: updatePatientDto.name,
      currency: updatePatientDto.currency,
    });
  }

  async remove(id: number) {
    return await this.patientRepository.softDelete(id);
  }
}
