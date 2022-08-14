import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MODEL_NAME } from 'src/constants';
import {
  ICartDocument,
  IOrderDocument,
  IProductDocument,
  IUserDocument,
} from 'src/interfaces';
@Injectable()
export class NlpActionService {
  constructor(
    @InjectModel(MODEL_NAME.CART) private cartModel: Model<ICartDocument>,
    @InjectModel(MODEL_NAME.ORDER) private orderModel: Model<IOrderDocument>,
    @InjectModel(MODEL_NAME.PRODUCT)
    private productModel: Model<IProductDocument>,
    @InjectModel(MODEL_NAME.USER) private userModel: Model<IUserDocument>,
  ) {}

  async bruh(contextMap) {
    return { context_map: { ...contextMap, name: 'Huy Nguyen' } };
  }

  async confirmOrder(contextMap) {
    return { context_map: { ...contextMap, order_success: true } };
  }

  async processPayment(contextMap) {
    return contextMap;
  }
}
