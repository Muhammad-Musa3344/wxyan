
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  create(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.create(createSiteDto);
  }

  @Get()
  findAll(@Query('address') address?: string) {
    if (address) {
      return this.sitesService.findByAddress(address);
    }

    return this.sitesService.findAll();
  }
}
