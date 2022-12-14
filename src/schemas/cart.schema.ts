import * as mongoose from 'mongoose';
import { MODEL_NAME } from 'src/constants';
import { ICart, ICartDocument } from 'src/interfaces';

const CartSchema = new mongoose.Schema<
  ICartDocument,
  mongoose.Model<ICartDocument>,
  ICart
>(
  {
    user_id: String,
    product_id: String,
    quantity: Number,
  },
  {
    collection: 'carts',
    autoIndex: true,
    autoCreate: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CartSchema.virtual('_user', {
  ref: MODEL_NAME.USER,
  localField: 'user_id',
  foreignField: 'user_id',
  justOne: true,
});

CartSchema.virtual('_product', {
  ref: MODEL_NAME.PRODUCT,
  localField: 'product',
  foreignField: '_id',
  justOne: true,
});

export default CartSchema;
