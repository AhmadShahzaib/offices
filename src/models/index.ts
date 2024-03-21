export * from './request.model';
export * from './response.model';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  NotEquals,
  IsNumber,
  ValidateNested,
} from 'class-validator';
export enum OdometerUnits {
  Miles = 'mi',
  Kilometers = 'km',
}

export interface GeoLocation {
  type: string;
  coordinates: number[];
}
export const searchableAttributes = [
  'name',
  'address',
  'description',
  'phoneNumber',
  'city',
  'state',
  'country',
];

export const sortableAttributes = [
  'name',
  'address',
  'description',
  'phoneNumber',
  'city',
  'state',
  'country',
  'isActive'
];
