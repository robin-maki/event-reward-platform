import { z } from 'zod';
import 'dotenv/config';

const schema = z.object({
  AUTH_SERVICE_HOST: z.string().default('auth'),
  AUTH_SERVICE_PORT: z.number().default(4000),
  DATABASE_URL: z.string().default('mongodb://mongo:27017/erp'),
  GATEWAY_PORT: z.number().default(3000),
  JWT_SECRET: z.string(),
  EVENT_SERVICE_HOST: z.string().default('event'),
  EVENT_SERVICE_PORT: z.number().default(4001),
});

export const env = schema.parse(process.env);
