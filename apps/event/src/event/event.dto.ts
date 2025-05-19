import { z } from 'zod';
import { EventConditions, EventState } from './event.schema';

const eventConditionsSchema: z.ZodType<EventConditions> = z.union([
  z.object({
    url: z.string(),
    condition: z.any(),
  }),
  z.object({ and: z.lazy(() => eventConditionsSchema.array()) }),
  z.object({ or: z.lazy(() => eventConditionsSchema.array()) }),
]);

export const createEventSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  conditions: eventConditionsSchema,
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  state: z.nativeEnum(EventState).default(EventState.ACTIVE),
});
export type CreateEventDto = z.infer<typeof createEventSchema>;

export const getEventSchema = z.object({
  id: z.string(),
});
export type GetEventDto = z.infer<typeof getEventSchema>;

