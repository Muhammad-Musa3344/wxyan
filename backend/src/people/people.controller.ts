import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { PeopleService } from './people.service';
import { CreatePersonDto } from './dto/create-person.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  create(@Body() dto: CreatePersonDto) {
    return this.peopleService.create(dto);
  }

  @Get()
  findAll() {
    return this.peopleService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.peopleService.findById(id);
  }
}