import { Document, Schema } from 'mongoose';
import { TimeZone } from '../../models/timeZone.model';
import { GeoLocationModel } from 'models/geoLocation.model';
import { GeoLocationRequestModel } from 'models/geoLocation.model';
export default interface OfficeDocument extends Document {
  name: string;
  address: string;
  phoneNumber: string;
  description?: string;
  tenantId?: string;
  isHeadOffice: boolean;
  isActive:boolean;
  timeZone: string | TimeZone;
  geoLocation: GeoLocationModel | GeoLocationRequestModel;
  city: string;
  state: string;
  country: string;
  isDeleted?: boolean;
}
