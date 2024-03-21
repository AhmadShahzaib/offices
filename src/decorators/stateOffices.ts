import { Get, HttpStatus, SetMetadata } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import {
  CombineDecorators,
  CombineDecoratorType,
  OFFICES,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { OfficeResponse } from '../models/response.model';

export default function GetStateOfficesDecorators() {
  const GetStateOfficesDecorators: Array<CombineDecoratorType> = [
    Get('/state/:state'),
    SetMetadata('permissions', [OFFICES.STATES]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.OK, type: OfficeResponse }),
    ApiParam({
      name: 'state',
      description: 'isoCode of the State',
      required: false,
    }),
  ];
  return CombineDecorators(GetStateOfficesDecorators);
}
