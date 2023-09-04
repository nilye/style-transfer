import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function validationExceptionFactory(errors: ValidationError[]) {
  const error = errors[0];

  const reason = {
    description: Object.values(error.constraints).join(', '),
    param: error.property,
    value: error.value,
  };

  if (error.constraints.isNotEmpty) {
    return new BadRequestException('Missing required parameter', reason);
  } else {
    return new UnsupportedMediaTypeException('Invalid input data', reason);
  }
}
