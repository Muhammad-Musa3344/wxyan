
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Site, SiteDocument } from '../sites/schemas/site.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Site.name)
    private readonly siteModel: Model<SiteDocument>,
  ) {}

  async search(query: string) {
    const searchTerm = query.trim();

    if (!searchTerm) {
      return [];
    }

    const escapedQuery = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );

    return this.siteModel
      .find({
        $or: [
          { title: { $regex: escapedQuery, $options: 'i' } },
          { html: { $regex: escapedQuery, $options: 'i' } },
        ],
      })
      .select('address title authorId')
      .lean()
      .exec();
  }
}
