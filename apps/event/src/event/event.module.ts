import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reward, RewardSchema } from 'reward/reward.schema';
import { EventController } from './event.controller';
import { Event, EventSchema } from './event.schema';
import { EventService } from './event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
    ]),
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
