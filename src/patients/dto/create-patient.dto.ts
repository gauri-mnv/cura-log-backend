import { ApiProperty, PickType } from '@nestjs/swagger';
import { Patient } from '../entities/patient.entity';

export class CreatePatientDto extends PickType(Patient, ['name', 'currency']) {
  @ApiProperty({ type: 'number' })
  userId: number;
}
