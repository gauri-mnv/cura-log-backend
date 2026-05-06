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
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { PatientsService } from '../patients/patients.service';
import { CategoriesService } from '../categories/categories.service';

@ApiTags('Record')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('records')
export class RecordsController {
  constructor(
    private readonly recordsService: RecordsService,
    private readonly usersService: UsersService,
    private readonly patientsService: PatientsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  async create(@Body() createRecordDto: CreateRecordDto, @Request() req) {
    // Validate the user
    const user = await this.usersService.findById(req.user.id);

    if (!user) {
      throw new UnauthorizedException('Unable to create category');
    }
    return this.recordsService.create(createRecordDto, req.user.id);
  }

  @Get('/patient/:id')
  async findAll(@Param('id') id: number) {
    const patient = await this.patientsService.findOne(id);

    if (!patient) {
      throw new BadRequestException('Patient does not exist');
    }

    return await this.recordsService.findAll(patient);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.recordsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRecordDto: UpdateRecordDto,
    @Request() req,
  ) {
    const record = await this.recordsService.findOne(id);

    if (!record) {
      throw new BadRequestException('Record does not exist');
    }

    return await this.recordsService.update(+id, updateRecordDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    return await this.recordsService.remove(+id, req.user.id);
  }

  @Get('/category/:categoryId/notes')
  async getNotes(@Param('categoryId') categoryId: number) {
    // Get all the notes of that category
    const category = await this.categoriesService.findOne(categoryId);

    if (!category) {
      throw new BadRequestException('The category does not exist');
    }

    const records = await this.recordsService.getNotes(category);
    return records.reduce((notes: string[], record) => {
      if (record.notes && !notes.find((note) => note === record.notes)) {
        notes.push(record.notes);
      }
      return notes;
    }, []);
  }
}
