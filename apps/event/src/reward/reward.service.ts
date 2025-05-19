import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Model } from 'mongoose';
import { EventService } from '../event/event.service';
import { Reward, RewardDocument, RewardType } from './reward.schema';
import { RewardClaim, RewardClaimResult } from './reward-claim.schema';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
    @InjectModel(RewardClaim.name) private rewardClaimModel: Model<RewardClaim>,
    @Inject() private eventService: EventService,
  ) {}

  async create(eventId: string, rewards: RewardType[]) {
    const reward = await this.rewardModel.create({
      event: eventId,
      rewards,
    });

    await reward.save();

    return reward;
  }

  async get(rewardId: string) {
    return await this.rewardModel.findById(rewardId);
  }

  private async createRewardClaimLog(
    rewardId: string,
    eventId: string,
    accountId: string,
    result: RewardClaimResult,
  ) {
    const rewardClaim = await this.rewardClaimModel.create({
      reward: rewardId,
      event: eventId,
      account: accountId,
      result,
      timestamp: dayjs(),
    });

    await rewardClaim.save();

    return rewardClaim;
  }

  async listClaims() {
    return await this.rewardClaimModel.find({}).sort({ timestamp: -1 });
  }

  async listClaimsByAccount(accountId: string) {
    return await this.rewardClaimModel.find({ account: accountId }).sort({ timestamp: -1 });
  }

  async claim(reward: RewardDocument, accountId: string) {
    const event = await this.eventService.get(reward.event.toString());

    if (!event) {
      return null;
    }

    if (
      event.state === 'INACTIVE' ||
      event.startDate?.isBefore(dayjs()) ||
      event.endDate?.isAfter(dayjs())
    ) {
      return await this.createRewardClaimLog(
        reward._id.toString(),
        event._id.toString(),
        accountId,
        'NOT_ACTIVE',
      );
    }

    const isConditionsMet = await this.eventService.checkConditions(event, accountId);

    if (!isConditionsMet) {
      return await this.createRewardClaimLog(
        reward._id.toString(),
        event._id.toString(),
        accountId,
        'CONDITION_NOT_MET',
      );
    }

    const existingRewardClaim = await this.rewardClaimModel.findOne({
      event: event._id,
      account: accountId,
      result: 'SUCCEED',
    });

    if (existingRewardClaim) {
      return await this.createRewardClaimLog(
        reward._id.toString(),
        event._id.toString(),
        accountId,
        'ALREADY_RECEIVED',
      );
    }

    return await this.createRewardClaimLog(
      reward._id.toString(),
      event._id.toString(),
      accountId,
      'SUCCEED',
    );
  }
}
