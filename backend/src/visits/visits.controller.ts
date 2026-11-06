
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { VisitsService } from './visits.service';
import { NavigateDto } from './dto/navigate.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get(':personId')
  getHistory(@Param('personId') personId: string) {
    return this.visitsService.getHistory(personId);
  }

  @Post(':personId/navigate')
  navigate(
    @Param('personId') personId: string,
    @Body() dto: NavigateDto,
  ) {
    return this.visitsService.navigate(personId, dto);
  }

  @Post(':personId/state')
  updateState(
    @Param('personId') personId: string,
    @Body() dto: UpdateStateDto,
  ) {
    return this.visitsService.updateState(personId, dto.state);
  }

  @Post(':personId/back')
  back(@Param('personId') personId: string) {
    return this.visitsService.back(personId);
  }

  @Post(':personId/forward')
  forward(@Param('personId') personId: string) {
    return this.visitsService.forward(personId);
  }
}
