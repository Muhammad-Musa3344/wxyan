import { PeopleModule } from './people/people.module';
import { VisitsModule } from './visits/visits.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { SitesModule } from './sites/sites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          'mongodb://127.0.0.1:27017/wxyan',
        serverSelectionTimeoutMS: 5000,
      }),
    }),

    SitesModule,
    PeopleModule,
    VisitsModule,
  ],
})
export class AppModule {}
