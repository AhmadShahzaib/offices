import { Model, Schema } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '@shafiqrathore/logeld-tenantbackend-common-future';
import { InjectModel } from '@nestjs/mongoose';
import { OfficeRequest } from './models';
import { EditOfficeRequest } from './models/editRequest.model';
import OfficeDocument from './mongoDb/document/document';

@Injectable()
export class AppService extends BaseService<OfficeDocument> {
  protected _model: Model<OfficeDocument>;
  private readonly logger = new Logger('OfficesService');
  constructor(
    @InjectModel('Offices')
    private readonly officeModel: Model<OfficeDocument>,
  ) {
    super();
    this._model = officeModel;
  }
  addOffice = async (office: OfficeRequest): Promise<OfficeDocument> => {
    try {
      Logger.debug(office);
      return await this.officeModel.create(office);
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
  updateOffice = async (
    id: string,
    office: EditOfficeRequest,
  ): Promise<OfficeDocument> => {
    try {
      return await this.officeModel.findByIdAndUpdate(id, office, {
        new: true,
      });
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  count = (options) => {
    try {
      return this.officeModel
        .count(options)
        .and([{ isDeleted: false }])
        .exec();
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
  officeStatus = async (
    id: string,
    status: boolean,
  ): Promise<OfficeDocument> => {
    try {
      return await this.officeModel
        .findByIdAndUpdate(
          id,
          { isActive: status },
          {
            new: true,
          },
        )
        .and([{ isDeleted: false }]);
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  findOfficeById = async (
    id: string,
    option: any = {},
  ): Promise<OfficeDocument> => {
    try {
      return await this.officeModel
        .findById(id)
        .and([{ isDeleted: false }, option]);
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  findHeadOffice = async (): Promise<OfficeDocument> => {
    try {
      return await this.officeModel
        .findOne({ isHeadOffice: true })
        .and([{ isDeleted: false }, { isActive: true }]);
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
  findOfficesOfState = async (name: string): Promise<OfficeDocument[]> => {
    try {
      const res = await this.officeModel.find({
        state: name,
        isDeleted: false,
      });
      return res;
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  find = (options) => {
    try {
      const query = this.officeModel.find(options);
      query.and([{ isDeleted: false }]);
      return query;
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  deleteOne = async (id: string) => {
    try {
      return await this.officeModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { upsert: true },
      );
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };

  findOne = async (option): Promise<OfficeDocument> => {
    try {
      return await this.officeModel.findOne(option);
    } catch (err) {
      this.logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  };
}
