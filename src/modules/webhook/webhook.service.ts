import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidVerifyToken } from './exceptions';
import {
  CONFIDENCE_THRESHOLD,
  DEFINED_ENTITIES,
  DEFINED_INTENTS,
} from './webhook.constants';
import * as util from 'util';
import { WebhookDto } from './dtos';
import { ReplierService } from '../replier/replier.service';
@Injectable()
export class WebhookService {
  constructor(
    private configService: ConfigService,
    private replierService: ReplierService,
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

  async processWebhookEvents(data: WebhookDto) {
    console.log(util.inspect(data, { showHidden: false, depth: null }));

    const nlpEntities = data.entry[0].messaging[0].message.nlp?.entities;
    let intent = '';

    if (
      nlpEntities.intent &&
      nlpEntities.intent[0].confidence >= CONFIDENCE_THRESHOLD
    ) {
      intent = nlpEntities.intent[0].value;
    }

    switch (intent) {
      case DEFINED_INTENTS.GREET:
        await this.replierService.sendGreet();
        break;
      case DEFINED_INTENTS.GOODBYE:
        await this.replierService.sendGoodbye();
        break;
      case DEFINED_INTENTS.HELP:
        await this.replierService.sendHelp();
        break;
      case DEFINED_INTENTS.ORDER_REQUEST:
        await this.replierService.processOrderRequest();
        break;
      case DEFINED_INTENTS.ORDER_PAYMENT:
        await this.replierService.processOrderPayment();
        break;
      default:
        await this.replierService.sendDefault();
    }
  }
}
