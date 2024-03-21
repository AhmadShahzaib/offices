
import {
  HttpStatus,
  Post,
  SetMetadata,
} from '@nestjs/common';
import { ApiOperation, ApiResponse,ApiBearerAuth} from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  GetOperationId,
  ErrorType,
  OFFICES,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { OfficeResponse } from '../models/response.model';

export default function AddDecorators() {
  const DeleteDecorators: Array<CombineDecoratorType> = [
    Post('add'),
    SetMetadata('permissions', [OFFICES.ADD]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.CREATED, type: OfficeResponse }),
    ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorType }),
    ApiOperation(GetOperationId('Office', 'Add')),
  ];
  return CombineDecorators(DeleteDecorators);
}
