import { HttpStatus, Patch, SetMetadata } from '@nestjs/common';

import { ApiParam, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  OFFICES,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { OfficeResponse } from '../models/response.model';

export default function IsActiveDecorators() {
  const IsActiveDecorators: Array<CombineDecoratorType> = [
    Patch('/status/:id'),
    SetMetadata('permissions', [OFFICES.DEACTIVATE]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.OK, type: OfficeResponse }),
    ApiParam({
      name: 'id',
      description: 'The ID of the Office you want to change the status',
    }),
  ];
  return CombineDecorators(IsActiveDecorators);
}
