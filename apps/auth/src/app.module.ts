import { env } from '@erp/env';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from 'account/account.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MongooseModule.forRoot(env.DATABASE_URL), AuthModule, AccountModule],
})
export class AppModule {}
