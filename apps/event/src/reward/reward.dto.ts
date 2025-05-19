import { z } from 'zod';

export const createRewardSchema = z.object({
  eventId: z.string(),
  rewards: z
    .discriminatedUnion('kind', [
      z.object({
        kind: z.literal('POINT'),
        amount: z.number(),
      }),
      z.object({
        kind: z.literal('ITEM'),
        itemId: z.string(),
        amount: z.number(),
      }),
      z.object({
        kind: z.literal('COUPON'),
        code: z.string(),
      }),
    ])
    .array(),
});
export type CreateRewardDto = z.infer<typeof createRewardSchema>;

export const claimRewardSchema = z.object({
  rewardId: z.string(),
  accountId: z.string(),
});
export type ClaimRewardDto = z.infer<typeof claimRewardSchema>;

export const listClaimsByAccountSchema = z.object({
  accountId: z.string(),
});
export type ListClaimsByAccountDto = z.infer<typeof listClaimsByAccountSchema>;
