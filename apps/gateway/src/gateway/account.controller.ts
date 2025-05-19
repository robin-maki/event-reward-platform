import { Body, Controller, Inject, Param,Post, Put, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Roles,RolesGuard } from '../auth/roles.guard';
import { handleRxErrorAndThrow } from '../error';
import { AccountDto } from './account.dto';
import type { CreateAccountDto, UpdateAccountRoleDto } from '@erp/auth/account/account.dto';
import type { AccountDocument } from '@erp/auth/account/account.schema';

@Controller('account')
export class AccountController {
  constructor(@Inject('AUTH_SERVICE') private authService: ClientProxy) {}

  @Post()
  async createAccount(@Body() body: CreateAccountDto) {
    const account = (await firstValueFrom(
      this.authService.send({ cmd: 'createAccount' }, body).pipe(handleRxErrorAndThrow),
    )) as AccountDocument;

    return AccountDto.of(account);
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Put(':id/role')
  async updateAccountRole(@Param('id') id: string, @Body() body: Omit<UpdateAccountRoleDto, 'id'>) {
    const account = (await firstValueFrom(
      this.authService
        .send({ cmd: 'updateAccountRole' }, { id, ...body })
        .pipe(handleRxErrorAndThrow),
    )) as AccountDocument;

    return AccountDto.of(account);
  }
}
