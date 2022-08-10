import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';

@Injectable()
export class ReplierService {
  constructor(private configService: ConfigService) {}

  async sendMessageApi(follower_psid, response) {
    let requestBody = {
      recipient: { id: follower_psid },
      message: response,
    };

    const result = await axios.post(
      this.configService.get('facebook.uri'),
      requestBody,
      {
        params: {
          accessToken: this.configService.get('facebook.access_token'),
        },
      },
    );
    console.log(result);
    return result;
  }

  async sendDefault() {}
  async sendGreet() {}
  async sendGoodbye() {}
  async sendHelp() {}
  async processOrderPayment() {}
  async processOrderRequest() {}
}
