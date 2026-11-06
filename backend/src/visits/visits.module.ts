import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  VisitHistory,
  VisitHistorySchema,
} from './schemas/visit.schema';

import { Person, PersonSchema } from '../people/schemas/person.schema';
import { Site, SiteSchema } from '../sites/schemas/site.schema';

import { VisitsController } from './visits.controller';
import { VisitsService } from './visits.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisitHistory.name, schema: VisitHistorySchema },
      { name: Person.name, schema: PersonSchema },
      { name: Site.name, schema: SiteSchema },
    ]),
  ],
  controllers: [VisitsController],
  providers: [VisitsService],
  exports: [VisitsService],
})
export class VisitsModule {}