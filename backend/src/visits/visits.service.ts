import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  VisitHistory,
  VisitDocument,
  HistoryEntry,
} from './schemas/visit.schema';

import { Person, PersonDocument } from '../people/schemas/person.schema';
import { Site, SiteDocument } from '../sites/schemas/site.schema';
import { NavigateDto } from './dto/navigate.dto';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(VisitHistory.name)
    private readonly visitModel: Model<VisitDocument>,

    @InjectModel(Person.name)
    private readonly personModel: Model<PersonDocument>,

    @InjectModel(Site.name)
    private readonly siteModel: Model<SiteDocument>,
  ) {}

  private async validatePerson(personId: string) {
    if (!Types.ObjectId.isValid(personId)) {
      throw new BadRequestException('Invalid person ID.');
    }

    const person = await this.personModel.findById(personId);

    if (!person) {
      throw new NotFoundException('Person not found.');
    }

    return person;
  }

  private formatHistory(history: VisitDocument) {
    const entries = history.entries || [];

    return {
      personId: history.personId,
      entries,
      currentIndex: history.currentIndex,
      current: entries[history.currentIndex] || null,
      canGoBack: history.currentIndex > 0,
      canGoForward: history.currentIndex < entries.length - 1,
    };
  }

  async getHistory(personId: string) {
    await this.validatePerson(personId);

    const history = await this.visitModel.findOne({
      personId: new Types.ObjectId(personId),
    });

    if (!history) {
      return {
        personId,
        entries: [],
        currentIndex: -1,
        current: null,
        canGoBack: false,
        canGoForward: false,
      };
    }

    return this.formatHistory(history);
  }

  async navigate(personId: string, dto: NavigateDto) {
    await this.validatePerson(personId);

    const address = dto.address.trim();

    let history = await this.visitModel.findOne({
      personId: new Types.ObjectId(personId),
    });

    if (!history) {
      history = new this.visitModel({
        personId: new Types.ObjectId(personId),
        entries: [],
        currentIndex: -1,
      });
    }

    const site = await this.siteModel.findOne({ address });

    const entry: HistoryEntry = {
      address,
      title: site?.title || 'Page not found',
      html: site?.html || '<h1>404 - Page not found</h1><p>This address does not exist in the simulated web.</p>',
      status: site ? 200 : 404,
      visitedAt: new Date(),
      state: dto.state || {},
    };

    // Discard the forward branch when navigating from the middle.
    const previousEntries = history.entries.slice(
      0,
      history.currentIndex + 1,
    );

    previousEntries.push(entry);

    history.entries = previousEntries;
    history.currentIndex = previousEntries.length - 1;

    await history.save();

    return this.formatHistory(history);
  }

  async back(personId: string) {
    await this.validatePerson(personId);

    const history = await this.visitModel.findOne({
      personId: new Types.ObjectId(personId),
    });

    if (!history || history.currentIndex <= 0) {
      throw new BadRequestException('No previous page available.');
    }

    history.currentIndex -= 1;

    await history.save();

    return this.formatHistory(history);
  }

  async forward(personId: string) {
    await this.validatePerson(personId);

    const history = await this.visitModel.findOne({
      personId: new Types.ObjectId(personId),
    });

    if (
      !history ||
      history.currentIndex >= history.entries.length - 1
    ) {
      throw new BadRequestException('No next page available.');
    }

    history.currentIndex += 1;

    await history.save();

    return this.formatHistory(history);
  }
}