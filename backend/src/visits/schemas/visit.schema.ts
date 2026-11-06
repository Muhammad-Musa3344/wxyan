import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VisitDocument = HydratedDocument<VisitHistory>;

@Schema({ _id: false })
export class HistoryEntry {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  html: string;

  @Prop({ default: 200 })
  status: number;

  @Prop({ default: Date.now })
  visitedAt: Date;

  @Prop({ type: Object, default: {} })
  state: Record<string, unknown>;
}

export const HistoryEntrySchema =
  SchemaFactory.createForClass(HistoryEntry);

@Schema({ timestamps: true })
export class VisitHistory {
  @Prop({
    type: Types.ObjectId,
    ref: 'Person',
    required: true,
    unique: true,
    index: true,
  })
  personId: Types.ObjectId;

  @Prop({
    type: [HistoryEntrySchema],
    default: [],
  })
  entries: HistoryEntry[];

  @Prop({ default: -1 })
  currentIndex: number;
}

export const VisitHistorySchema =
  SchemaFactory.createForClass(VisitHistory);