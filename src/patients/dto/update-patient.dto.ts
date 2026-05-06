import { PickType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';
import { Patient } from '../entities/patient.entity';

export class UpdatePatientDto extends PickType(Patient, ['name', 'currency']) {}
