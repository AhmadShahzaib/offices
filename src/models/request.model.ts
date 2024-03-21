import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Schema } from 'mongoose';
import { TimeZone } from './timeZone.model';
import { GeoLocationModel, GeoLocationRequestModel } from './geoLocation.model';
export class OfficeRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  tenantId?: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  isHeadOffice: boolean;

  @ApiProperty({ type: GeoLocationRequestModel })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GeoLocationRequestModel)
  geoLocation: GeoLocationModel | GeoLocationRequestModel;

  @ApiProperty({
    type: 'string'
  })
  @IsNotEmpty()
  timeZone: string | TimeZone;

  @ApiProperty()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsOptional()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  isActive: boolean;
}
