import { AccountDocument } from '@erp/auth/account/account.schema';

export class AccountDto {
  _id: string;
  name: string;
  email: string;
  role: string;

  static of(account: AccountDocument): AccountDto {
    return {
      _id: account._id.toString(),
      name: account.name,
      email: account.email,
      role: account.role,
    };
  }
}
