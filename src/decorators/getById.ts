import { Get, HttpStatus, SetMetadata } from '@nestjs/common';

import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  OFFICES,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { OfficeResponse } from '../models/response.model';

export default function GetByIdDecorators() {
  const GetByIdDecorators: Array<CombineDecoratorType> = [
    Get(':id'),

    SetMetadata('permissions', [OFFICES.GETBYID]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.OK, type: OfficeResponse }),
    ApiParam({
      name: 'id',
      description: 'The ID of the office you want to get.',
    }),
  ];
  return CombineDecorators(GetByIdDecorators);
}
