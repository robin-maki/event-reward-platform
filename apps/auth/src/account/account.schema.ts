import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export const AccountRole = {
  USER: 'USER',
  OPERATOR: 'OPERATOR',
  AUDITOR: 'AUDITOR',
  ADMIN: 'ADMIN',
} as const;
export type AccountRole = keyof typeof AccountRole;

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: AccountRole })
  role: AccountRole;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
