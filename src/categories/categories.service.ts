import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CategoryType, IconName } from '../enums';

const CLINICAL_CATEGORIES = [
  {
    name: 'Registration',
    icon: IconName.HOSPITAL,
    type: CategoryType.FIXED,
    editable: false,
  },
  {
    name: 'Tele-Video',
    icon: IconName.PHONE,
    type: CategoryType.VARIABLE,
    editable: true,
  },
  {
    name: 'Lab-Pathology',
    icon: IconName.SYRINGE,
    type: CategoryType.VARIABLE,
    editable: true,
  },
  {
    name: 'Admin-Forms',
    icon: IconName.BRIEF_CASE,
    type: CategoryType.FIXED,
    editable: true,
  },
  {
    name: 'Surcharge',
    icon: IconName.CASH_COIN,
    type: CategoryType.VARIABLE,
    editable: true,
  },
];

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    const category = await this.categoryRepository.create({
      name: createCategoryDto.name,
      icon: createCategoryDto.icon,
      user: user,
      enable: true,
      type: createCategoryDto.type,
      editable: createCategoryDto.editable ?? true,
    });

    return await this.categoryRepository.save(category);
  }

  async findAll(userId: number) {
    await this.ensureClinicalCategories(userId);

    return await this.categoryRepository.find({
      where: {
        user: {
          id: userId,
        },
        type: In([CategoryType.FIXED, CategoryType.VARIABLE]),
      },
    });
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (!category?.editable) {
      return category;
    }

    return await this.categoryRepository.save({
      id: id,
      name: updateCategoryDto.name,
      icon: updateCategoryDto.icon,
      enable: updateCategoryDto.enable,
      type: updateCategoryDto.type,
      editable: updateCategoryDto.editable,
    });
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    if (!category?.editable) {
      return category;
    }

    return await this.categoryRepository.softDelete(id);
  }

  async ensureClinicalCategories(userId: number) {
    const existing = await this.categoryRepository.find({
      where: { user: { id: userId } },
    });
    const existingNames = new Set(existing.map((category) => category.name));
    const categoriesToCreate = CLINICAL_CATEGORIES.filter(
      (category) => !existingNames.has(category.name),
    );

    if (!categoriesToCreate.length) {
      return existing;
    }

    const newCategories = await this.categoryRepository.save(
      categoriesToCreate.map((category) =>
        this.categoryRepository.create({
          ...category,
          enable: true,
          user: { id: userId } as User,
        }),
      ),
    );

    return [...existing, ...newCategories];
  }
}
