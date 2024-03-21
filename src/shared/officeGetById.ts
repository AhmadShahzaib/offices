import { OfficeResponse } from '../models';
import { NotFoundException, Logger } from '@nestjs/common';
import { AppService } from 'app.service';
export const officeById = async (
  officeService: AppService,
  id: string,
  option: any = {},
): Promise<OfficeResponse> => {
  try {
    Logger.log(`want to get office byId : ${id}`);
    const office = await officeService.findOfficeById(id, option);
    if (office && Object.keys(office).length > 0) {
      Logger.log(`office Found with id : ${id}`);
      const resultData: OfficeResponse = new OfficeResponse(office);
      return resultData;
    } else {
      Logger.log(`office not Found`);
      throw new NotFoundException('office not found');
    }
  } catch (error) {
    Logger.error({ message: error.message, stack: error.stack });
    throw error;
  }
};
