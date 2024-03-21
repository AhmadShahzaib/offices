import { States } from './state.model';
import { ApiProperty } from '@nestjs/swagger';
import OfficeDocument from 'mongoDb/document/document';
import { GeoLocation } from './';
import { Schema } from 'mongoose';
import { TimeZone } from './timeZone.model';
import { BaseResponseType } from '@shafiqrathore/logeld-tenantbackend-common-future';
export class OfficeResponse extends BaseResponseType {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  tenantId?: string;

  @ApiProperty()
  geoLocation: GeoLocation;

  @ApiProperty()
  timeZone?: string | TimeZone;

  @ApiProperty()
  country: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  isActive: boolean;


  @ApiProperty()
  isHeadOffice: boolean;

  constructor(officeDocument: OfficeDocument) {
    super();
    this.id = officeDocument.id;
    this.name = officeDocument.name;
    this.address = officeDocument.address;
    this.state = officeDocument.state;
    this.address = officeDocument.address;
    this.country = officeDocument.country;
    this.description = officeDocument.description;
    this.timeZone = officeDocument.timeZone;
    this.isHeadOffice = officeDocument.isHeadOffice;
    this.geoLocation = officeDocument.get('geoLocation');
    this.isActive=officeDocument.isActive;
    this.city=officeDocument.city;
    this.phoneNumber=officeDocument.phoneNumber;
    this.tenantId = officeDocument.tenantId
  }
}
