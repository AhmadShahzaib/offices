import { v4 as uuidv4 } from 'uuid';
import * as mongoose from 'mongoose';
const TimeZoneSchema = new mongoose.Schema(
  {
    tzCode: { type: String, required: true },
    utc: { type: String, required: true },
    label: { type: String },
    name: { type: String },
  },
  { _id: false },
);
export const OfficeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    address: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String ,default:null },
    country: { type: String, required: true },
    geoLocation: {
      type: { type: String, enum: ['Point'] },
      coordinates: [Number]
    },
    timeZone: { type: TimeZoneSchema, required: true },
    city: { type: String, required: true },
    state: { type: String, required: false },
    isHeadOffice: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
OfficeSchema.index({ geolocation: '2dsphere' });
