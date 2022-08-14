import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidVerifyToken } from './exceptions';
import { WebhookEntryDto } from './dtos';
import { NlpService } from '../nlp/nlp.service';
import * as util from 'util';

@Injectable()
export class WebhookService {
  constructor(
    private configService: ConfigService,
    private nlpService: NlpService,
  ) {}

  verifyWebhook(data: any) {
    console.log(data);
    const mode = data['hub.mode'],
      verifyToken = data['hub.verify_token'],
      challenge = data['hub.challenge'];

    const pageVerifyToken = this.configService.get('facebook.verify_token');

    if (mode === 'subscribe' && verifyToken === pageVerifyToken) {
      return challenge;
    }
    throw new InvalidVerifyToken('Invalid verify token!');
  }

  async processWebhookEvents(data: WebhookEntryDto, req: any) {
    const messageText = data.messaging[0].message.text;

    // const nlpEntities = await this.nlpService.message(messageText);
    const sender = data.messaging[0].sender.id;
    console.log(sender);
    const { sessionId, contextMap } =
      this.nlpService.findOrCreateSession(sender);

    const result = await this.nlpService.runComposer(
      sessionId,
      contextMap,
      messageText,
    );

    return result;
  }
}
