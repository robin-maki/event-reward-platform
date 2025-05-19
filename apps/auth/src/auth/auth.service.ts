import { Inject,Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from '@node-rs/argon2';
import { AccountService } from '../account/account.service';
import type { AccountDocument } from 'account/account.schema';
import type { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private accountService: AccountService,
    @Inject() private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginDto) {
    const account = await this.accountService.findByEmail(email);
    if (!account) {
      return null;
    }

    if (!(await verify(account.password, password))) {
      return null;
    }

    return account;
  }

  async signJwtToken(account: AccountDocument) {
    return this.jwtService.sign({
      sub: account._id,
      email: account.email,
      name: account.name,
      role: account.role,
    });
  }
}
