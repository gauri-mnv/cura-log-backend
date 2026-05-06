import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
  Request,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { Patient } from './entities/patient.entity';

@ApiTags('Patient')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @Body() createPatientDto: CreatePatientDto,
    @Request() req,
  ): Promise<Patient> {
    // Validate the user
    const user = await this.usersService.findById(createPatientDto.userId);

    if (user.id !== req.user.id) {
      throw new UnauthorizedException('Unable to create patient');
    }
    return await this.patientsService.create(createPatientDto, user);
  }

  @Get('/user/:id')
  async findAll(@Request() req, @Param('id') id: number) {
    const user = await this.usersService.findById(id);

    if (user.id !== req.user.id) {
      throw new UnauthorizedException('Unable to fetch patient list');
    }

    return await this.patientsService.findAll(user.id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.patientsService.findOne(+id);
  // }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePatientDto: UpdatePatientDto,
    @Request() req,
  ) {
    // Check patient is existing
    const patient = await this.patientsService.findOne(id);
    if (!patient) {
      throw new BadRequestException('Patient does not exist.');
    }

    const user = await this.usersService.findById(req.user.id);

    if (!user) {
      throw new UnauthorizedException(
        'You have no access to update this patient',
      );
    }

    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    // Check patient is existing
    const patient = await this.patientsService.findOne(id);

    if (!patient) {
      throw new BadRequestException('Patient does not exist.');
    }

    return await this.patientsService.remove(patient.id);
  }
}
