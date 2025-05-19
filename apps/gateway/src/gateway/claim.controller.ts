import { Controller, Get, Inject, Request,UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Roles,RolesGuard } from '../auth/roles.guard';
import { handleRxErrorAndThrow } from '../error';

@Controller('claim')
export class ClaimController {
  constructor(@Inject('EVENT_SERVICE') private eventService: ClientProxy) {}

  @UseGuards(RolesGuard)
  @Roles('OPERATOR', 'AUDITOR')
  @Get()
  async getClaim() {
    return await firstValueFrom(
      this.eventService.send({ cmd: 'listClaims' }, {}).pipe(handleRxErrorAndThrow),
    );
  }

  @UseGuards(RolesGuard)
  @Roles('USER')
  @Get('me')
  async listMyClaims(@Request() req: any) {
    return await firstValueFrom(
      this.eventService
        .send({ cmd: 'listClaimsByAccount' }, { accountId: req.user.accountId })
        .pipe(handleRxErrorAndThrow),
    );
  }
}
