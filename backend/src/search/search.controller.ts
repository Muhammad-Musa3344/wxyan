
import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';

import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query('q') query: string) {
    if (!query || !query.trim()) {
      throw new BadRequestException(
        'Please provide a search query using ?q=',
      );
    }

    return this.searchService.search(query);
  }
}
