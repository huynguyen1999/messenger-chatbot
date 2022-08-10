import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidVerifyToken } from './exceptions';

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
    const message = data?.entry[0]?.messaging[0]?.message;
    console.log('message', message);
    console.log('nlp', message?.nlp);
  }
}
