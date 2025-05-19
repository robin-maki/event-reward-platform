import { EventDocument, EventState } from '@erp/event/event/event.schema';
import { RewardDocument, RewardType } from '@erp/event/reward/reward.schema';
import type { Dayjs } from 'dayjs';

export class EventWithRewardsDto {
  _id: string;
  name: string;
  description?: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  state: EventState;
  rewards?: RewardDto[];

  static of(event: EventDocument & { rewards?: RewardDocument[] }): EventWithRewardsDto {
    console.log(event);

    return {
      _id: event._id.toString(),
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      state: event.state,
      rewards: event.rewards?.map(RewardDto.of) ?? [],
    };
  }
}

export class RewardDto {
  _id: string;
  rewards: RewardType[];

  static of(reward: RewardDocument): RewardDto {
    return {
      _id: reward._id.toString(),
      rewards: reward.rewards,
    };
  }
}