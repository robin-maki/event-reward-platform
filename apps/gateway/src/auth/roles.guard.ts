import { AccountRole } from '@erp/auth/account/account.schema';
import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AccountRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<AccountRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (user.role === 'ADMIN') {
      return true;
    }
    return requiredRoles.some((role) => user.role === role);
  }
}
