import { assertOrThrow, ZodValidationPipe } from '@erp/utils';
import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { loginSchema } from './auth.dto';
import { AuthService } from './auth.service';
import type {LoginDto} from './auth.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @MessagePattern({ cmd: 'login' })
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Payload() data: LoginDto) {
    const account = await this.authService
      .validateUser(data)
      .then(assertOrThrow(() => new RpcException({ code: 'invalid_credentials' })));

    return await this.authService.signJwtToken(account);
  }
}
