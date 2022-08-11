import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { MODEL_NAME } from 'src/constants';
import { UserDto } from '../webhook/dtos';
import { CONFIDENCE_THRESHOLD } from '../webhook/webhook.constants';
import { RESPONSE_TEMPLATE } from './replier.constants';
import { Model } from 'mongoose';
import {
  ICartDocument,
  IFollowerDocument,
  IProductDocument,
} from 'src/interfaces';
@Injectable()
export class ReplierService {
  constructor(
    private configService: ConfigService,
    @InjectModel(MODEL_NAME.CART) cartModel: Model<ICartDocument>,
    @InjectModel(MODEL_NAME.FOLLOWER) followerModel: Model<IFollowerDocument>,
    @InjectModel(MODEL_NAME.PRODUCT) productModel: Model<IProductDocument>,
  ) {}

  async sendMessageApi(follower_psid: string, response: any) {
    let requestBody = {
      recipient: { id: follower_psid },
      message: response,
    };

    const messageUrl =
      this.configService.get('facebook.uri') +
      `?access_token=${this.configService.get('facebook.access_token')}`;

    const result = await axios.post(messageUrl, requestBody);

    return result;
  }

  async sendDefault(follower: UserDto) {
    return await this.sendMessageApi(follower.id, RESPONSE_TEMPLATE.DEFAULT);
  }
  async sendGreet(follower: UserDto) {
    return await this.sendMessageApi(follower.id, RESPONSE_TEMPLATE.GREET);
  }
  async sendGoodbye(follower: UserDto) {
    return await this.sendMessageApi(follower.id, RESPONSE_TEMPLATE.GOODBYE);
  }
  async sendHelp(follower: UserDto) {
    return await this.sendMessageApi(follower.id, RESPONSE_TEMPLATE.HELP);
  }

  async processOrderRequest(follower: UserDto, nlpEntities: any) {
    const { product, address } = nlpEntities;

    if (!product || product[0].confidence < CONFIDENCE_THRESHOLD) {
      return await this.sendMessageApi(
        follower.id,
        RESPONSE_TEMPLATE.REQUEST_PRODUCT,
      );
    }
    if (!address || address[0].confidence < CONFIDENCE_THRESHOLD) {
      return await this.sendMessageApi(
        follower.id,
        RESPONSE_TEMPLATE.REQUEST_ADDRESS,
      );
    }
    const response = {
      text: `Your order:\n  Product: ${product[0].value}\n  Shipping address: ${address[0].value}`,
    };
    return await this.sendMessageApi(follower.id, response);
  }

  async processOrderPayment(follower: UserDto, nlpEntities: any) {}
}
