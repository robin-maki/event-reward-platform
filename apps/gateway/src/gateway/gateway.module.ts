import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AccountController } from './account.controller';
import { ClaimController } from './claim.controller';
import { EventController } from './event.controller';
import { env } from '@erp/env';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: env.AUTH_SERVICE_HOST,
          port: env.AUTH_SERVICE_PORT,
        },
      },
      {
        name: 'EVENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: env.EVENT_SERVICE_HOST,
          port: env.EVENT_SERVICE_PORT,
        },
      },
    ]),
  ],
  controllers: [AccountController, EventController, ClaimController],
})
export class GatewayModule {}
