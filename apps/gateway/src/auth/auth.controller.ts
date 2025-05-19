import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';
import { handleRxErrorAndThrow } from '../error';
import { Roles,RolesGuard } from './roles.guard';
import type { CreateAccountDto, UpdateAccountRoleDto } from '@erp/auth/account/account.dto';
import type { AccountDocument } from '@erp/auth/account/account.schema';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authService: ClientProxy) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any) {
    return { access_token: req.user };
  }

  @Post('account')
  async createAccount(@Body() body: CreateAccountDto) {
    const account = (await firstValueFrom(
      this.authService.send({ cmd: 'createAccount' }, body).pipe(handleRxErrorAndThrow),
    )) as AccountDocument;

    return {
      _id: account._id,
      name: account.name,
      email: account.email,
      role: account.role,
    };
  }

  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Put('account/:id/role')
  async updateAccountRole(@Param('id') id: string, @Body() body: Omit<UpdateAccountRoleDto, 'id'>) {
    const account = (await firstValueFrom(
      this.authService
        .send({ cmd: 'updateAccountRole' }, { id, ...body })
        .pipe(handleRxErrorAndThrow),
    )) as AccountDocument;

    return {
      _id: account._id,
      name: account.name,
      email: account.email,
      role: account.role,
    };
  }
}
