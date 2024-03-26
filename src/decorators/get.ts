import { Get, HttpStatus, SetMetadata } from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';

import {
  CombineDecorators,
  CombineDecoratorType,
  OFFICES,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { OfficeResponse } from '../models/response.model';
import { sortableAttributes } from '../models';

export default function GetDecorators() {
  const GetDecorators: Array<CombineDecoratorType> = [
    Get(),

    SetMetadata('permissions', [OFFICES.LIST]),
    ApiBearerAuth("access-token"),
    ApiResponse({ status: HttpStatus.OK, type: OfficeResponse }),
    ApiQuery({
      name: 'search',
      example: 'search by name ,city, country etc',
      required: false,
      
    }),
    ApiQuery({
      name: 'orderBy',
      example: 'Field by which record will be ordered',
      required: false,
      enum: sortableAttributes,
    }),
    ApiQuery({
      name: 'orderType',
      example: 'Ascending(1),Descending(-1)',
      enum: [1, -1],
      required: false,
    }),
    ApiQuery({
      name: 'pageNo',
      example: '1',
      description: 'The pageNo you want to get e.g 1,2,3 etc',
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      example: '10',
      description: 'The number of records you want on one page.',
      required: false,
    }),
  ];
  return CombineDecorators(GetDecorators);
}
