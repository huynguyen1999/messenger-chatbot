import { Module } from '@nestjs/common';
import { WebhookModule } from './modules/webhook/webhook.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { ReplierModule } from './modules/replier/replier.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    WebhookModule,
    ReplierModule,
  ],
})
export class AppModule {}
