import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { RESPONSE_TEMPLATE } from './replier.constants';

@Injectable()
export class ReplierService {
  constructor(private configService: ConfigService) {}

  async sendMessageApi(follower_psid, response) {
    let requestBody = {
      recipient: { id: follower_psid },
      message: response,
    };

    const messageUrl =
      this.configService.get('facebook.uri') +
      `?access_token=${this.configService.get('facebook.access_token')}`;
    console.log(messageUrl);
    const result = await axios.post(messageUrl, requestBody);
    console.log(result);
    return result;
  }

  async sendDefault(follower) {
    return await this.sendMessageApi(follower.id, RESPONSE_TEMPLATE.DEFAULT);
  }
  async sendGreet(follower) {
    return await this.sendMessageApi(follower.id, RESPONSE_TEMPLATE.GREET);
  }
  async sendGoodbye(follower) {
    return await this.sendMessageApi(follower.id, RESPONSE_TEMPLATE.GOODBYE);
  }
  async sendHelp(follower) {
    return await this.sendMessageApi(follower.id, RESPONSE_TEMPLATE.HELP);
  }
  async processOrderPayment(follower) {}
  async processOrderRequest(follower) {}
}
