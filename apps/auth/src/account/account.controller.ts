import { ZodValidationPipe } from '@erp/utils';
import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  createAccountSchema,
  updateAccountRoleSchema
} from './account.dto';
import { AccountService } from './account.service';
import type {CreateAccountDto, UpdateAccountRoleDto} from './account.dto';

@Controller()
export class AccountController {
  constructor(private accountService: AccountService) {}

  @MessagePattern({ cmd: 'createAccount' })
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async create(@Payload() data: CreateAccountDto) {
    return await this.accountService.create(data);
  }

  @MessagePattern({ cmd: 'updateAccountRole' })
  @UsePipes(new ZodValidationPipe(updateAccountRoleSchema))
  async updateRole(@Payload() data: UpdateAccountRoleDto) {
    return await this.accountService.updateRole(data);
  }
}
