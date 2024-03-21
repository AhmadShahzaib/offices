import { Put, HttpStatus, SetMetadata } from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  ErrorType,
  OFFICES,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { OfficeResponse } from '../models/response.model';

export default function UpdateByIdDecorators() {
  const UpdateByIdDecorators: Array<CombineDecoratorType> = [
    Put(':id'),
    SetMetadata('permissions', [OFFICES.EDIT]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.OK, type: OfficeResponse }),
    ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorType }),
    ApiParam({
      name: 'id',
      description: 'The ID of the office you want to update.',
    }),
  ];
  return CombineDecorators(UpdateByIdDecorators);
}
