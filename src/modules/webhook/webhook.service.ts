import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidVerifyToken } from './exceptions';
import {
  CONFIDENCE_THRESHOLD,
  DEFINED_ENTITIES,
  DEFINED_INTENTS,
} from './webhook.constants';
import * as util from 'util';
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
    console.log(util.inspect(data, { showHidden: false, depth: null }));

    const nlpEntities = data.entry[0].messaging[0].message.nlp?.entities;
    let { value: intent = '', confidence = 0 } =
      nlpEntities?.intent?.at(0)?.value;

    if (confidence < CONFIDENCE_THRESHOLD) {
      intent = DEFINED_INTENTS.OUT_OF_SCOPE;
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
      default:
        break;
    }
  }
}
