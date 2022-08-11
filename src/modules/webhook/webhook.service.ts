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
import {Wit} from 'node-wit';
@Injectable()
export class WebhookService {
  private witai:any;
  constructor(
    private configService: ConfigService,
    private replierService: ReplierService,
  ) {
    // this.witai = new Wit();
  }

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

  async processWebhookEvents(data: WebhookDto, req: any) {
    console.log(util.inspect(data, { showHidden: false, depth: null }));
    const follower = data.entry[0].messaging[0].sender;
    const nlpEntities: any = data.entry[0].messaging[0].message.nlp?.entities;
    // let intent = '';

    const { intent=[], ...entities } = nlpEntities;
    console.log(intent);
    // if (
    //   nlpEntities.intent &&
    //   nlpEntities.intent[0].confidence >= CONFIDENCE_THRESHOLD
    // ) {
    //   intent = nlpEntities.intent[0].value;
    // }
   

    switch (intent[0].value) {
      case DEFINED_INTENTS.GREET:
        await this.replierService.sendGreet(follower);
        break;
      case DEFINED_INTENTS.GOODBYE:
        await this.replierService.sendGoodbye(follower);
        break;
      case DEFINED_INTENTS.HELP:
        await this.replierService.sendHelp(follower);
        break;
      case DEFINED_INTENTS.ORDER_REQUEST:
        await this.replierService.processOrderRequest(follower, nlpEntities);
        break;
      case DEFINED_INTENTS.ORDER_PAYMENT:
        await this.replierService.processOrderPayment(follower, nlpEntities);
        break;
      default:
        await this.replierService.sendDefault(follower);
    }
  }
}
