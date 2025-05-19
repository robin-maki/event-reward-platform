import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from 'event/event.module';
import { RewardController } from './reward.controller';
import { Reward, RewardSchema } from './reward.schema';
import { RewardService } from './reward.service';
import { RewardClaim, RewardClaimSchema } from './reward-claim.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reward.name, schema: RewardSchema },
      { name: RewardClaim.name, schema: RewardClaimSchema },
    ]),
    EventModule,
  ],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
