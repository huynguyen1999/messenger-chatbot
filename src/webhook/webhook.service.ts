import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidVerifyToken } from './exceptions';
import {
  CONFIDENCE_THRESHOLD,
  DEFINED_ENTITIES,
  DEFINED_INTENTS,
} from './webhook.constants';
@Injectable()
export class WebhookService {
  constructor(private configService: ConfigService) {}

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

  async processWebhookEvents(data: any) {
    console.log(JSON.stringify(data));

    const nlpEntities = data?.entry[0]?.messaging[0]?.message?.nlp.entities;
    const { value: intent, confidence } = nlpEntities?.intent[0]?.value;

    if (confidence < CONFIDENCE_THRESHOLD) {
    }

    switch (intent) {
      case DEFINED_INTENTS.GREET:
        break;
      case DEFINED_INTENTS.GOODBYE:
        break;
      case DEFINED_INTENTS.HELP:
        break;
      case DEFINED_INTENTS.ORDER_REQUEST:
        // add to cart
        break;
      case DEFINED_INTENTS.ORDER_PAYMENT:
        // if cart.length > 0 we continue
        // else ...
        break;
    }
  }
}
