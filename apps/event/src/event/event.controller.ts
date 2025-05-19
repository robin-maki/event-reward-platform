import { assertOrThrow, ZodValidationPipe } from '@erp/utils';
import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateEventDto, createEventSchema, GetEventDto, getEventSchema } from './event.dto';
import { EventService } from './event.service';

@Controller()
export class EventController {
  constructor(private eventService: EventService) {}

  @MessagePattern({ cmd: 'createEvent' })
  @UsePipes(new ZodValidationPipe(createEventSchema))
  async create(@Payload() data: CreateEventDto) {
    return await this.eventService.create(data);
  }

  @MessagePattern({ cmd: 'getEvent' })
  @UsePipes(new ZodValidationPipe(getEventSchema))
  async get(@Payload() data: GetEventDto) {
    return await this.eventService
      .get(data.id)
      .then(assertOrThrow(() => new RpcException({ code: 'not_found' })));
  }

  @MessagePattern({ cmd: 'listEvents' })
  async list() {
    return await this.eventService.list();
  }
}
