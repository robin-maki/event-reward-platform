import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Dayjs } from 'dayjs';
import mongoose from 'mongoose';
import { DateTime } from '../type';
import type { HydratedDocument } from 'mongoose';

export const RewardClaimResult = {
  SUCCEED: 'SUCCEED',
  CONDITION_NOT_MET: 'CONDITION_NOT_MET',
  ALREADY_RECEIVED: 'ALREADY_RECEIVED',
  NOT_ACTIVE: 'NOT_ACTIVE',
} as const;
export type RewardClaimResult = keyof typeof RewardClaimResult;

@Schema()
export class RewardClaim {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  account: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  event: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' })
  reward: mongoose.Types.ObjectId;

  @Prop({ type: String, enum: RewardClaimResult })
  result: RewardClaimResult;

  @Prop({ type: DateTime })
  timestamp: Dayjs;
}

export type RewardClaimDocument = HydratedDocument<RewardClaim>;
export const RewardClaimSchema = SchemaFactory.createForClass(RewardClaim);
