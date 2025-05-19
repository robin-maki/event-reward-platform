import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import type { HydratedDocument } from 'mongoose';

export type RewardType =
  | {
      kind: 'POINT';
      amount: number;
    }
  | {
      kind: 'ITEM';
      itemId: string;
      amount: number;
    }
  | {
      kind: 'COUPON';
      code: string;
    };

export type RewardDocument = HydratedDocument<Reward>;

@Schema()
export class Reward {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  event: mongoose.Types.ObjectId;

  @Prop({ type: [Object] })
  rewards: RewardType[];
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
