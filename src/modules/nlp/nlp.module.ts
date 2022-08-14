import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL_NAME } from 'src/constants';
import CartSchema from 'src/schemas/cart.schema';
import OrderSchema from 'src/schemas/order.schema';
import ProductSchema from 'src/schemas/product.schema';
import UserSchema from 'src/schemas/user.schema';
import { NlpActionService } from './nlp.action.service';
import { NlpService } from './nlp.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL_NAME.CART, schema: CartSchema },
      { name: MODEL_NAME.ORDER, schema: OrderSchema },
      { name: MODEL_NAME.PRODUCT, schema: ProductSchema },
      { name: MODEL_NAME.USER, schema: UserSchema },
    ]),
  ],
  providers: [NlpService, NlpActionService],
  exports: [NlpService],
})
export class NlpModule {}
