import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { NlpModule } from '../nlp/nlp.module';
import { configuration } from 'src/configuration';

const configs = configuration();
@Module({
  imports: [
    NlpModule.register({
      accessToken: configs.facebook.wit_token,
      apiVersion: configs.facebook.wit_version,
    }),
  ],
  providers: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
