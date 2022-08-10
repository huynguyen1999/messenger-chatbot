import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL_NAME } from 'src/constants';
import { ReplierService } from './replier.service';
import CartSchema from 'src/schemas/cart.schema';
import ProductSchema from 'src/schemas/product.schema';
import FollowerSchema from 'src/schemas/follower.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MODEL_NAME.PRODUCT, schema: ProductSchema },
      { name: MODEL_NAME.CART, schema: CartSchema },
      { name: MODEL_NAME.FOLLOWER, schema: FollowerSchema },
    ]),
  ],
  providers: [ReplierService],
  exports: [ReplierService],
})
export class ReplierModule {}
