import { EventDocument } from '@erp/event/event/event.schema';
import { CreateRewardDto } from '@erp/event/reward/reward.dto';
import { Body, Controller, Get,Inject, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Roles,RolesGuard } from '../auth/roles.guard';
import { handleRxErrorAndThrow } from '../error';
import { EventWithRewardsDto } from './event.dto';
import type { CreateEventDto } from '@erp/event/event/event.dto';

@Controller('event')
export class EventController {
  constructor(@Inject('EVENT_SERVICE') private eventService: ClientProxy) {}

  @UseGuards(RolesGuard)
  @Roles('OPERATOR')
  @Post()
  async createEvent(@Body() body: CreateEventDto) {
    return EventWithRewardsDto.of(
      (await firstValueFrom(
        this.eventService.send({ cmd: 'createEvent' }, body).pipe(handleRxErrorAndThrow),
      )) as EventDocument,
    );
  }

  @Get()
  async listEvents() {
    return (
      (await firstValueFrom(
        this.eventService.send({ cmd: 'listEvents' }, {}).pipe(handleRxErrorAndThrow),
      )) as EventDocument[]
    ).map(EventWithRewardsDto.of);
  }

  @Get(':id')
  async getEvent(@Param('id') id: string) {
    return EventWithRewardsDto.of(
      (await firstValueFrom(
        this.eventService.send({ cmd: 'getEvent' }, { id }).pipe(handleRxErrorAndThrow),
      )) as EventDocument,
    );
  }

  @UseGuards(RolesGuard)
  @Roles('OPERATOR')
  @Post(':id/reward')
  async createReward(@Param('id') id: string, @Body() body: Omit<CreateRewardDto, 'eventId'>) {
    return await firstValueFrom(
      this.eventService
        .send({ cmd: 'createReward' }, { eventId: id, ...body })
        .pipe(handleRxErrorAndThrow),
    );
  }

  @UseGuards(RolesGuard)
  @Roles('USER')
  @Post(':eventId/reward/:rewardId/claim')
  async claimReward(@Request() req: any, @Param('rewardId') rewardId: string) {
    return await firstValueFrom(
      this.eventService.send({ cmd: 'claimReward' }, { accountId: req.user.accountId, rewardId }).pipe(handleRxErrorAndThrow),
    );
  }


}
