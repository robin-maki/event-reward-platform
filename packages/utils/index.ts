import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { RpcException } from '@nestjs/microservices';

export const assertOrThrow =
  <T>(errorThrower: () => Error | never) =>
  (value: T | null | undefined): T => {
    if (value === null || value === undefined) {
      throw errorThrower();
    }
    return value;
  };

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, _: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    }
    catch (error) {
      throw new RpcException({ code: 'validation_failed', message: error.message });
    }
  }
}
