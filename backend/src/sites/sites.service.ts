
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import sanitizeHtml from 'sanitize-html';

import { Site, SiteDocument } from './schemas/site.schema';
import { CreateSiteDto } from './dto/create-site.dto';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name)
    private readonly siteModel: Model<SiteDocument>,
  ) {}

  async create(dto: CreateSiteDto) {
    const address = dto.address.trim();

    const existingSite = await this.siteModel.findOne({ address });

    if (existingSite) {
      throw new ConflictException(
        'A website with this address already exists.',
      );
    }

    const safeHtml = sanitizeHtml(dto.html, {
      allowedTags: [
        'h1', 'h2', 'h3', 'h4',
        'p', 'div', 'span',
        'ul', 'ol', 'li',
        'a', 'strong', 'b', 'em', 'i',
        'blockquote', 'pre', 'code',
        'br', 'hr',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
      ],
      allowedAttributes: {
        a: ['href', 'title'],
        '*': ['class'],
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      allowProtocolRelative: false,
      disallowedTagsMode: 'discard',
    });

    try {
      return await this.siteModel.create({
        address,
        title: dto.title.trim(),
        html: safeHtml,
        authorId: dto.authorId,
      });
} catch (error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  ) {
    throw new ConflictException(
      'A website with this address already exists.',
    );
  }

  throw error;
}
  }

  async findAll() {
    return this.siteModel
      .find()
      .sort({ createdAt: -1 })
      .select('-__v')
      .exec();
  }

  async findByAddress(address: string) {
    const site = await this.siteModel
      .findOne({ address: address.trim() })
      .select('-__v')
      .exec();

    if (!site) {
      throw new NotFoundException('Website not found.');
    }

    return site;
  }
}
