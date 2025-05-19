import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from '@node-rs/argon2';
import { Account, AccountRole } from './account.schema';
import type { Model, ObjectId } from 'mongoose';
import type { CreateAccountDto, UpdateAccountRoleDto } from './account.dto';

@Injectable()
export class AccountService {
  constructor(@InjectModel(Account.name) private accountModel: Model<Account>) {}

  async create({ email, password, name }: CreateAccountDto) {
    const existingAccount = await this.accountModel.findOne({ email });
    if (existingAccount) {
      throw new RpcException({ code: 'email_exists' });
    }

    const hashedPassword = await hash(password);

    const account = await this.accountModel.create({
      email,
      password: hashedPassword,
      name,
      role: AccountRole.USER,
    });

    await account.save();

    return account;
  }

  async get(id: string | ObjectId) {
    return await this.accountModel.findById(id);
  }

  async findByEmail(email: string) {
    return await this.accountModel.findOne({ email });
  }

  async updateRole({ id, role }: UpdateAccountRoleDto) {
    return await this.accountModel.findByIdAndUpdate(id, { role }, { new: true });
  }
}
