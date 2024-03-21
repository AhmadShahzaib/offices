import { OfficeRequest } from '../models/request.model';
import { OfficeResponse } from '../models';
import { NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { AppService } from 'app.service';
import timezones from 'timezones-list';
import { EditOfficeRequest } from 'models/editRequest.model';
import { State, Country } from 'country-state-city';
// import {
//   GeoLocationModel,
//   GeoLocationRequestModel,
// } from '../models/geoLocation.model';

export const addAndUpdateOffice = async (
  officeService: AppService,
  officeModel: OfficeRequest | EditOfficeRequest,
  options: any = {},
): Promise<OfficeRequest | EditOfficeRequest> => {
  const office = await officeService.findOne(options);
  if (office && office.name.toLowerCase() === officeModel.name.toLowerCase()) {
    Logger.log(`office already exist with name :${officeModel.name}`);
    throw new ConflictException(`Office name already exists`);
  }

  if (office && office.phoneNumber === officeModel.phoneNumber) {
    Logger.log(
      `office already exist with phoneNo. :${officeModel.phoneNumber}`,
    );
    throw new ConflictException(`Phone number already exists`);
  }
  const index = timezones.findIndex((ele) => {
    return ele.tzCode == (officeModel.timeZone as string);
  });
  if (index >= 0) {
    Logger.log('timeZone Found');
    officeModel.timeZone = timezones[index];
  } else {
    Logger.log(`timeZone not Found ${officeModel.timeZone}`);
    throw new NotFoundException(`TimeZone you selected does not exists`);
  }
  const country = Country.getCountryByCode(officeModel.country as string);
  if (!country) {
    Logger.log(`Country Not found`);
    throw new NotFoundException(`Country you selected does not exists`);
  }
  const state = State.getStateByCodeAndCountry(
    officeModel.state as string,
    officeModel.country,
  );
  if (!state) {
    Logger.log(`State Not found`);
    throw new NotFoundException(`State you select does not exist`);
  }
  officeModel.country = country.name;
  officeModel.state = state.name;
  // const location: GeoLocationModel = {
  //   coordinates: [
  //     (officeModel.geoLocation as GeoLocationRequestModel).longitude,
  //     (officeModel.geoLocation as GeoLocationRequestModel).latitude,
  //   ],
  //   type: 'Point',
  // };
  // officeModel.geoLocation = location;
  return officeModel;
};
