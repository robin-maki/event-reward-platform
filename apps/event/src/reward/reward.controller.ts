import { assertOrThrow, ZodValidationPipe } from '@erp/utils';
import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { match } from 'ts-pattern';
import {
  ClaimRewardDto,
  claimRewardSchema,
  CreateRewardDto,
  createRewardSchema,
  ListClaimsByAccountDto,
  listClaimsByAccountSchema,
} from './reward.dto';
import { RewardService } from './reward.service';

@Controller()
export class RewardController {
  constructor(private rewardService: RewardService) {}

  @MessagePattern({ cmd: 'createReward' })
  @UsePipes(new ZodValidationPipe(createRewardSchema))
  async create(@Payload() data: CreateRewardDto) {
    return await this.rewardService.create(data.eventId, data.rewards);
  }

  @MessagePattern({ cmd: 'claimReward' })
  @UsePipes(new ZodValidationPipe(claimRewardSchema))
  async claimReward(@Payload() data: ClaimRewardDto) {
    const reward = await this.rewardService
      .get(data.rewardId)
      .then(assertOrThrow(() => new RpcException({ code: 'not_found' })));

    const claimResult = await this.rewardService
      .claim(reward, data.accountId)
      .then(assertOrThrow(() => new RpcException({ code: 'not_found' })));

    return match(claimResult.result)
      .with('SUCCEED', () => claimResult.toObject())
      .with('CONDITION_NOT_MET', () => {
        throw new RpcException({ code: 'condition_not_met' });
      })
      .with('ALREADY_RECEIVED', () => {
        throw new RpcException({ code: 'already_received' });
      })
      .with('NOT_ACTIVE', () => {
        throw new RpcException({ code: 'not_active' });
      })
      .exhaustive();
  }

  @MessagePattern({ cmd: 'listClaims' })
  async listClaims() {
    return await this.rewardService.listClaims();
  }

  @MessagePattern({ cmd: 'listClaimsByAccount' })
  @UsePipes(new ZodValidationPipe(listClaimsByAccountSchema))
  async listClaimsByAccount(@Payload() data: ListClaimsByAccountDto) {
    return await this.rewardService.listClaimsByAccount(data.accountId);
  }
}
