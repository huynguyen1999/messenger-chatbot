import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { ReplierModule } from '../replier/replier.module';

@Module({
  imports: [ReplierModule],
  providers: [WebhookService],
  controllers: [WebhookController],
})
export class WebhookModule {}
