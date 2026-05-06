import { ApiProperty, PickType } from '@nestjs/swagger';
import { Record } from '../entities/record.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Category } from '../../categories/entities/category.entity';

export class CreateRecordDto extends PickType(Record, [
  'price',
  'notes',
  'date',
  'isEmergency',
  'surchargePercent',
]) {
  @ApiProperty({ type: () => Patient })
  patient: Patient;

  @ApiProperty({ type: () => Category })
  category: Category;
}
