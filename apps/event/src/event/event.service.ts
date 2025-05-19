import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Reward } from 'reward/reward.schema';
import format from 'string-template';
import { dezerialize } from 'zodex';
import { CreateEventDto } from './event.dto';
import { Event, EventConditions, EventDocument } from './event.schema';
import type { Model, ObjectId } from 'mongoose';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
  ) {}

  async create({ name, description, conditions, startDate, endDate, state }: CreateEventDto) {
    const event = await this.eventModel.create({
      name,
      description,
      conditions,
      startDate,
      endDate,
      state,
    });

    await event.save();

    return event.toObject();
  }

  async get(id: string | ObjectId) {
    const event = await this.eventModel.findById(id);
    if (event) {
      const rewards = await this.rewardModel.find({ event: event._id });
      return { ...event.toObject(), rewards };
    }
    return null;
  }

  async list() {
    const events = await this.eventModel.find({});

    return await Promise.all(
      events.map(async (event) => {
        const rewards = await this.rewardModel.find({ event: event._id });
        return { ...event.toObject(), rewards };
      }),
    );
  }

  async checkConditions(event: Pick<EventDocument, 'conditions'>, accountId: string | ObjectId) {
    accountId = String(accountId);

    const checkCondition = async (condition: EventConditions): Promise<boolean> => {
      if ('url' in condition) {
        try {
          const result = await axios.get(format(condition.url, { accountId }));
          if (condition.condition) {
            const schema = dezerialize(condition.condition);
            return schema.safeParse(result.data).success;
          }
          else {
            return result.status >= 200 && result.status < 300;
          }
        }
        catch {
          return false;
        }
      }
      else {
        const operands = 'and' in condition ? condition.and : condition.or;
        return await Promise.all(operands.map((condition) => checkCondition(condition))).then(
          (results) =>
            'and' in condition
              ? results.every((result) => result)
              : results.some((result) => result),
        );
      }
    };

    return await checkCondition(event.conditions);
  }
}
