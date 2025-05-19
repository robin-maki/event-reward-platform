import { env } from '@erp/env';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from 'event/event.module';
import { RewardModule } from 'reward/reward.module';

@Module({
  imports: [MongooseModule.forRoot(env.DATABASE_URL), EventModule, RewardModule],
})
export class AppModule {}
