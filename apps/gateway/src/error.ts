import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, throwError } from 'rxjs';
import { match } from 'ts-pattern';

export const handleRxErrorAndThrow = catchError((err) =>
  match(err.code)
    .with('not_found', () => throwError(() => new NotFoundException(err)))
    .with('invalid_credentials', () => throwError(() => new UnauthorizedException(err)))
    .with('validation_failed', () => throwError(() => new BadRequestException(err)))
    .with('email_exists', () => throwError(() => new ConflictException(err)))
    .with('condition_not_met', () => throwError(() => new BadRequestException(err)))
    .with('already_received', () => throwError(() => new ConflictException(err)))
    .with('not_active', () => throwError(() => new BadRequestException(err)))
    .otherwise(() => throwError(() => new InternalServerErrorException(err))),
);
