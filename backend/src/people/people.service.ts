import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Person, PersonDocument } from './schemas/person.schema';
import { CreatePersonDto } from './dto/create-person.dto';

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel(Person.name)
    private readonly personModel: Model<PersonDocument>,
  ) {}

  async create(dto: CreatePersonDto) {
    const email = dto.email.trim().toLowerCase();

    try {
      return await this.personModel.create({
        ...dto,
        email,
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException(
          'A person with this email already exists.',
        );
      }

      throw error;
    }
  }

  async findAll() {
    return this.personModel.find().sort({ name: 1 }).select('-__v').exec();
  }

  async findById(id: string) {
    const person = await this.personModel
      .findById(id)
      .select('-__v')
      .exec();

    if (!person) {
      throw new NotFoundException('Person not found.');
    }

    return person;
  }
}