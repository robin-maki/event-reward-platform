import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { firstValueFrom } from 'rxjs';
import { handleRxErrorAndThrow } from '../error';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH_SERVICE') private authService: ClientProxy) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    return await firstValueFrom(
      this.authService.send({ cmd: 'login' }, { email, password }).pipe(handleRxErrorAndThrow),
    );
  }
}
