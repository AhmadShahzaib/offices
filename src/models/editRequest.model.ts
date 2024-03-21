import { States } from './state.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional,IsObject,ValidateNested } from 'class-validator';
import { Schema } from 'mongoose';
import { TimeZone } from './timeZone.model';
import { Type } from 'class-transformer';
import { GeoLocationModel ,GeoLocationRequestModel} from './geoLocation.model';
export class EditOfficeRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  isHeadOffice: boolean;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  @ApiProperty()
  @IsNotEmpty()
  tenantId?: Schema.Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  description: string;


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
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  city: string;
  
  @ApiProperty()
  isActive: boolean;
}
