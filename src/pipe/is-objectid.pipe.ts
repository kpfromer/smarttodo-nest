import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

import { Validator } from 'class-validator';

export const IsObjectIdPipe = {
  transform: (value: any, metadata: ArgumentMetadata): any => {
    const { metatype } = metadata;

    const validator = new Validator();

    if (!metatype) {
      throw new BadRequestException('No ObjectId');
    } else if (
      metatype !== String ||
      !validator.isMongoId(value)
    ) {
      throw new BadRequestException('Invalid ObjectId');
    }

    return value;
  }
};