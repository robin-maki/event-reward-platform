import dayjs, { Dayjs } from 'dayjs';

export const DateTime = {
  type: String,
  get: (v: string) => dayjs(v),
  set: (v: Dayjs) => v.toISOString(),
} as const;
