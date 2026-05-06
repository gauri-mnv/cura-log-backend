import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './entities/record.entity';
import { AuditLog } from './entities/audit-log.entity';
import { UsersModule } from '../users/users.module';
import { PatientsModule } from '../patients/patients.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Record, AuditLog]),
    UsersModule,
    PatientsModule,
    CategoriesModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
