import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { MODEL_NAME } from 'src/constants';
import {
  ICartDocument,
  IOrderDocument,
  IProductDocument,
  IUserDocument,
} from 'src/interfaces';
import { STATUS } from './nlp.types';
@Injectable()
export class NlpActionService {
  constructor(
    private configService: ConfigService,
    @InjectModel(MODEL_NAME.CART) private cartModel: Model<ICartDocument>,
    @InjectModel(MODEL_NAME.ORDER) private orderModel: Model<IOrderDocument>,
    @InjectModel(MODEL_NAME.PRODUCT)
    private productModel: Model<IProductDocument>,
    @InjectModel(MODEL_NAME.USER) private userModel: Model<IUserDocument>,
  ) {}

  async callSendMessageApi(user_id: string, response: any) {
    let requestBody = {
      recipient: { id: user_id },
      message: response,
    };
    const url = `${this.configService.get(
      'facebook.message_uri',
    )}?access_token=${this.configService.get('facebook.access_token')}`;

    const result = await axios({
      method: 'POST',
      url,
      data: requestBody,
    });
    return result.data;
  }

  async sendResponse(response: any, understanding: any) {
    return await this.callSendMessageApi(understanding.user_id, response);
  }

  defaultAction(contextMap: any, understanding: any) {
    return { context_map: { ...contextMap } };
  }

  setAddress(contextMap: any, understanding: any) {
    contextMap.address = understanding.text;
    return { context_map: { ...contextMap } };
  }
  setProduct(contextMap: any, understanding: any) {
    contextMap.product = understanding.text;
    return { context_map: { ...contextMap } };
  }
  clearOrder(contextMap: any, understanding: any) {
    return { context_map: {} };
  }

  async confirmOrder(contextMap: any, understanding: any) {
    const availableProduct = await this.productModel.findOne({
      name: contextMap.product,
    });
    if (availableProduct) {
      await this.orderModel.create({
        user_id: understanding.user_id,
        product_id: availableProduct._id,
        quantity: 1,
        address: contextMap.address,
        status: STATUS.UNPAID,
      });
      contextMap.order_success = true;
    }
    return { context_map: { ...contextMap } };
  }

  async processPayment(contextMap: any, understanding: any) {
    const yourOrders = await this.orderModel
      .find({
        user_id: understanding.user_id,
        status: STATUS.UNPAID,
      })
      .populate('_product');
      
    if (yourOrders) { 
      contextMap.unpaid_orders = yourOrders;
    }

    return { context_map: { ...contextMap } };
  }

  async sendPaymentLink(contextMap: any, understanding: any) {
    const response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: `Bạn có ${contextMap.unpaid_orders.length} đơn hàng.`,
          buttons: [
            {
              type: 'web_url',
              url: 'https://paylike.io/features/payment-link',
              title: 'Thanh toán',
              webview_height_ratio: 'tall',
              messenger_extensions: true,
            },
          ],
        },
      },
    };
    return await this.callSendMessageApi(understanding.user_id, response);
  }
}
