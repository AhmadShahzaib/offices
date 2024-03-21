import {
  Controller,
  Body,
  HttpStatus,
  Query,
  Res,
  Logger,
  Req,
  Param,
  NotFoundException,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response, Request, response } from 'express';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import {
  searchableAttributes,
  sortableAttributes,
  OfficeResponse,
  OfficeRequest,
} from './models';
import { AppService } from './app.service';
import { EditOfficeRequest } from './models/editRequest.model';
import AddDecorators from './decorators/add';
import DeleteDecorators from './decorators/delete';
import GetByIdDecorators from './decorators/getById';
import UpdateByIdDecorators from './decorators/updateById';
import GetDecorators from './decorators/get';
import IsActiveDecorators from './decorators/isActive';
import GetStateOfficesDecorators from './decorators/stateOffices';
import { State } from 'country-state-city';
import { officeById } from './shared/officeGetById';
import { IsActive } from './models/isActive.model';
import { addAndUpdateOffice } from './shared/addUpdateData.validator';
import {
  MongoIdValidationPipe,
  ListingParams,
  MessagePatternResponseInterceptor,
  ListingParamsValidationPipe,
  BaseController,
  MessagePatternResponseType,
  mapMessagePatternResponseToException,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { FilterQuery } from 'mongoose';
import OfficeDocument from 'mongoDb/document/document';
import { firstValueFrom } from 'rxjs';
import { request } from 'http';
@Controller('Offices')
@ApiTags('Offices')
export class AppController extends BaseController {
  constructor(
    private readonly officeService: AppService,
    @Inject('UNIT_SERVICE') private readonly unitClient: ClientProxy,
  ) {
    super();
  }

  @UseInterceptors(MessagePatternResponseInterceptor)
  @MessagePattern({ cmd: 'get_office_by_id' })
  async tcp_getOfficeById(id: string): Promise<OfficeResponse | Error> {
    try {
      Logger.log(`get offices ById :${id}`);
      const option = { IsActive: true };
      const office = await officeById(this.officeService, id, option);
      let headOffice = await this.officeService.findHeadOffice();
      office['headOffice'] = headOffice.address;
      office['headOfficeId'] = headOffice.id;
      return office;
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      return err;
    }
  }
  @GetDecorators()
  async getOffices(
    @Query(ListingParamsValidationPipe) queryParams: ListingParams,
    @Req() request:Request,
    @Res() response: Response,
  ) {
    try {
      const { tenantId: id } = request.user ?? ({ tenantId: undefined } as any);
      const options = {};
      const { search, orderBy, orderType, pageNo, limit } = queryParams;
       options['$and']=[{tenantId:id}]
      if (search) {
        options['$or'] = [];
       
        searchableAttributes.forEach((attribute) => {
          options['$or'].push({ [attribute]: new RegExp(search, 'i') });
        });
      }
      const query = this.officeService.find(options);
      if (orderBy && sortableAttributes.includes(orderBy)) {
        query.collation({ locale: 'en' }).sort({ [orderBy]: orderType ?? 1 });
      } else {
        query.sort({ createdAt: 1 });
      }
      const total = await this.officeService.count(options);
      let queryResponse;
      if (!limit || !isNaN(limit)) {
        query.skip(((pageNo ?? 1) - 1) * (limit ?? 10)).limit(limit ?? 10);
      }
      queryResponse = await query.exec();

      const responseData = queryResponse.map(
        (office) => new OfficeResponse(office),
      );
      return response.status(HttpStatus.OK).send({
        data: responseData,
        total,
        pageNo: pageNo ?? 1,
        tententID:id,
        last_page: Math.ceil(
          total /
            (limit && limit.toString().toLowerCase() === 'all'
              ? total
              : limit ?? 10),
        ),
      });
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  // @------------------- Delete Office API controller -------------------
  @DeleteDecorators()
  async deleteOffice(
    @Param('id', MongoIdValidationPipe) id: string,
    @Res() response: Response,
    @Req() req: Request,
  ) {
    try {
      Logger.log(`deleteOffice was called with params: ${id}`);
      Logger.log(
        `${req.method} request received from ${req.ip} for ${
          req.originalUrl
        } by: ${
          !response.locals.user ? 'Unauthorized User' : response.locals.user.id
        }`,
      );
      const office = await this.officeService.deleteOne(id);
      if (office && Object.keys(office).length > 0) {
        Logger.log(`office found against ${id}`);
        return response.status(HttpStatus.OK).send({
          message: 'office has been deleted successfully',
        });
      } else {
        Logger.log(`office not found against ${id}`);
        throw new NotFoundException('office not found');
      }
    } catch (error) {
      Logger.error(error.message, error.stack);
      throw error;
    }
  }

  @IsActiveDecorators()
  async driversStatus(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() request: IsActive,
    @Req() req: Request,
    @Res() response: Response,
  ) {
    try {
      Logger.log(`driverStatus was called with params: ${id}`);
      Logger.log(
        `${req.method} request received from ${req.ip} for ${
          req.originalUrl
        } by: ${
          !response.locals.user ? 'Unauthorized User' : response.locals.user.id
        }`,
      );
      const { isActive } = request;
      // const { permissions } = req.user ?? ({ permissions: undefined } as any);
      // const permission = permissions.find((permission) => {
      //   return permission.page === 'offices';
      // });
      // if(permission){
      //   if (isActive && !permission.canActivate) {
      //     throw new ForbiddenException("Don't have Permission to Activate");
      //   }
      //   if (!isActive && !permission.canDeactivate) {
      //     throw new ForbiddenException("Don't have Permission to DeActivate");
      //   }
      const office = await this.officeService.officeStatus(id, isActive);
      if (office && Object.keys(office).length > 0) {
        const result: OfficeResponse = new OfficeResponse(office);
        Logger.log(`office status changed `);
        return response.status(HttpStatus.OK).send({
          message: 'Office status has been changed successfully',
          data: result,
        });
      } else {
        Logger.log(`office not Found`);
        throw new NotFoundException('office not found');
      }
      // }
      // else{
      //   throw new ForbiddenException("Don't have Permission to Access this resource");
      // }
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }
  // @------------------- Get ONE office API controller -------------------
  @GetByIdDecorators()
  async getOfficeById(
    @Param('id', MongoIdValidationPipe) id: string,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    try {
      Logger.log(
        `${request.method} request received from ${request.ip} for ${
          request.originalUrl
        } by: ${
          !response.locals.user ? 'Unauthorized User' : response.locals.user.id
        }`,
      );

      Logger.log(`getOfficeById was called with params: ${id}`);
      const offices = await officeById(this.officeService, id);
      return response.status(HttpStatus.OK).send({
        message: 'Office Found',
        data: offices,
      });
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      throw err;
    }
  }

  @AddDecorators()
  async addOffices(
    @Body() officeModel: OfficeRequest,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    Logger.log(
      `${request.method} request received from ${request.ip} for ${
        request.originalUrl
      } by: ${
        !response.locals.user ? 'Unauthorized User' : response.locals.user.id
      }`,
    );
    Logger.log(`Request to add office :${officeModel}`);
    const { name, phoneNumber } = officeModel;
    const { tenantId } = request.user ?? ({ tenantId: undefined } as any);
    try {
      Logger.log(
        `calling findOne office Service method with office name: ${name}`,
      );
      const options: FilterQuery<OfficeDocument> = {
        $and: [{ isDeleted: false }],
        $or: [
          { name: { $regex: new RegExp(`^${officeModel.name}`, 'i') } },
          { phoneNumber: phoneNumber },
        ],
      };
      officeModel.tenantId = tenantId;
      const requestModel: OfficeRequest = (await addAndUpdateOffice(
        this.officeService,
        officeModel,
        options,
      )) as OfficeRequest;
      const addOffice = await this.officeService.addOffice(requestModel);
      if (addOffice && Object.keys(addOffice).length > 0) {
        Logger.log(`Office added successfully`);
        const result: OfficeResponse = new OfficeResponse(addOffice);
        return response.status(HttpStatus.CREATED).send({
          message: 'Office has been added successfully',
          data: result,
        });
      }
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }
  @UseInterceptors(new MessagePatternResponseInterceptor())
  @MessagePattern({ cmd: 'office' })
  async office(
    data
  ): Promise<OfficeResponse | Error> {
    try {
      const office = await this.officeService.addOffice(data);
      if (office && Object.keys(office).length > 0) {
        Logger.log(`user password update successfully`);
        return new OfficeResponse(office);
      } else {
        Logger.log(`not find  user`);
        throw new NotFoundException(`user not found`);
      }
    } catch (err) {
      Logger.error({ message: err.message, stack: err.stack });
      return err;
    }
  }
  // @----------------------update Offices-------------------------------
  @UpdateByIdDecorators()
  async update(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() editRequestData: EditOfficeRequest,
    @Res() response: Response,
    @Req() request: Request,
  ) {
    try {
      Logger.log(
        `${request.method} request received from ${request.ip} for ${
          request.originalUrl
        } by: ${
          !response.locals.user ? 'Unauthorized User' : response.locals.user.id
        }`,
      );
      Logger.log(`Request to update office :${editRequestData}`);
      const { name } = editRequestData;
      const option: FilterQuery<OfficeDocument> = {
        $and: [{ _id: { $ne: id }, isDeleted: false }],
        $or: [
          { name: { $regex: new RegExp(`^${editRequestData.name}`, 'i') } },
        ],
      };
      if (editRequestData.phoneNumber) {
        option.$or.push({ phoneNumber: editRequestData.phoneNumber });
      }
      const requestModel: EditOfficeRequest = (await addAndUpdateOffice(
        this.officeService,
        editRequestData,
        option,
      )) as EditOfficeRequest;
      const offices = await this.officeService.updateOffice(id, requestModel);

      const updateOfficeDetails = {
        headOfficeId: offices._id,
        headOffice: offices.name,
        homeTerminalAddress: offices.address,
      };

      /**
       * Update office details in unit - START
       */
      const messagePatternUnits =
        await firstValueFrom<MessagePatternResponseType>(
          this.unitClient.send(
            { cmd: 'update_office_details' },
            updateOfficeDetails,
          ),
        );

      if (messagePatternUnits.isError) {
        Logger.log(`Error while sending notification`);
        mapMessagePatternResponseToException(messagePatternUnits);
      }
      /**
       * Update office details in unit - END
       */

      if (offices && Object.keys(offices).length > 0) {
        const result: OfficeResponse = new OfficeResponse(offices);
        Logger.log(`office Update with id :${id} `);

        return response.status(HttpStatus.OK).send({
          message: 'Office has been updated successfully',
          data: result,
        });
      } else {
        throw new NotFoundException(`${id} does not exist`);
      }
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }

  @GetStateOfficesDecorators()
  async stateOffices(
    @Param('state') stateIso: string,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    try {
      Logger.log(`Request to get state  offices with isoCode :${stateIso}`);
      Logger.log(
        `${request.method} request received from ${request.ip} for ${
          request.originalUrl
        } by: ${!res.locals.user ? 'Unauthorized User' : res.locals.user.id}`,
      );

      const state = State.getStateByCodeAndCountry(stateIso, 'US');
      if (!state) {
        Logger.log(`not state found with isoCode :${stateIso}`);
        throw new NotFoundException(`${stateIso} not valid state`);
      }
      const stateOffice = await this.officeService.findOfficesOfState(
        state.name,
      );
      if (stateOffice && Object.keys(stateOffice).length > 0) {
        const data = stateOffice.map((office) => new OfficeResponse(office));
        return res.status(HttpStatus.OK).send({
          message: 'Offices of state found successfully',
          data,
        });
      } else {
        Logger.log('Not office Found');
        throw new NotFoundException('No offices found for this state');
      }
    } catch (error) {
      Logger.error({ message: error.message, stack: error.stack });
      throw error;
    }
  }
}
