import * as mongoose from 'mongoose';
import { MODEL_NAME } from 'src/constants';
import { ICart, ICartDocument } from 'src/interfaces';

const CartSchema = new mongoose.Schema<
  ICartDocument,
  mongoose.Model<ICartDocument>,
  ICart
>(
  {
    follower: String,
    product: String,
    quantity: Number,
  },
  {
    collection: 'zalo-messages',
    autoIndex: true,
    autoCreate: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CartSchema.virtual('_follower', {
  ref: MODEL_NAME.FOLLOWER,
  localField: 'follower',
  foreignField: 'messenger_id',
  justOne: true,
});

CartSchema.virtual('_product', {
  ref: MODEL_NAME.PRODUCT,
  localField: 'product',
  foreignField: '_id',
  justOne: true,
});

export default CartSchema;
