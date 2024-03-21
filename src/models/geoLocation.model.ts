import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  Allow,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeoLocationModel {
  @ApiProperty()
  type: string;
  @ApiProperty()
  coordinates: number[];
}
export class GeoLocationRequestModel {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Max(180)
  @Min(-180)
  longitude: number;
  @ApiProperty()
  @IsNumber()
  @Max(90)
  @Min(-90)
  @IsNotEmpty()
  latitude: number;
}
