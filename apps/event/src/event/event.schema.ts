import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Dayjs } from 'dayjs';
import { SzType } from 'zodex';
import { DateTime } from '../type';
import type { HydratedDocument } from 'mongoose';

export type EventCondition = {
  url: string;
  condition?: SzType;
};
export type EventConditions =
  | EventCondition
  | {
      and: EventConditions[];
    }
  | {
      or: EventConditions[];
    };

export const EventState = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;
export type EventState = keyof typeof EventState;

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop()
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Object })
  conditions: EventConditions;

  @Prop({ type: DateTime })
  startDate?: Dayjs;

  @Prop({ type: DateTime })
  endDate?: Dayjs;

  @Prop({ enum: EventState })
  state: EventState;
}

export const EventSchema = SchemaFactory.createForClass(Event);
