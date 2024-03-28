import { Module, Injectable } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import {
  ConfigurationService,
  MessagePatternResponseInterceptor,
  SharedModule,
} from '@shafiqrathore/logeld-tenantbackend-common-future';
import { OfficeSchema } from './mongoDb/schema/schema';
import { AppController } from './app.controller';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { APP_INTERCEPTOR } from '@nestjs/core';
import tunnel from 'tunnel-ssh';
import tunnelConfig from 'tunnelConfig';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([{ name: 'Offices', schema: OfficeSchema }]),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigurationService) => {
        const useTunnel = JSON.parse(
          configService.get('USE_TUNNEL') ?? 'false',
        );

        const mongooseConfig = {
          uri: configService.mongoUri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };

        // if (useTunnel) {
        //   const { devServerTunnelConfig } = tunnelConfig;
        //   return new Promise((res, rej) => {
        //     tunnel(devServerTunnelConfig, async (error, server) => {
        //       if (server) {
        //         // lets overwrite default mongouri to use tunnel-ssh
        //         mongooseConfig.uri = devServerTunnelConfig.mongoDBUri;
        //         console.log(
        //           `tunnel created with host: ${devServerTunnelConfig.host}`,
        //         );
        //         res(mongooseConfig);
        //       } else {
        //         console.log(
        //           `tunnel connection failed with: ${devServerTunnelConfig.host}`,
        //         );
        //         console.log(error);
        //         rej(error);
        //       }
        //     });
        //   });
        // }
        return mongooseConfig;
      },
      inject: [ConfigurationService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MessagePatternResponseInterceptor,
    },
    {
      provide: 'UNIT_SERVICE',
      useFactory: (config: ConfigurationService) => {
        const port: number = Number(config.get('UNIT_MICROSERVICE_PORT'));
        const host = config.get('UNIT_MICROSERVICE_HOST');

        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            port,
            host,
          },
        });
      },
      inject: [ConfigurationService],
    },
    AppService,
    ConfigurationService,
  ],
})
export class AppModule {
  static port: number | string;
  static isDev: boolean;

  constructor(private readonly _configurationService: ConfigurationService) {
    AppModule.port = AppModule.normalizePort(_configurationService.port);
    AppModule.isDev = _configurationService.isDevelopment;
  }

  /**
   * Normalize port or return an error if port is not valid
   * @param val The port to normalize
   */
  private static normalizePort(val: number | string): number | string {
    const port: number = typeof val === 'string' ? parseInt(val, 10) : val;

    if (Number.isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    throw new Error(`Port "${val}" is invalid.`);
  }
}
