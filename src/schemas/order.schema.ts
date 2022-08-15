import * as mongoose from 'mongoose';
import { MODEL_NAME } from 'src/constants';
import { IOrderDocument, IOrder } from 'src/interfaces';

const OrderSchema = new mongoose.Schema<
  IOrderDocument,
  mongoose.Model<IOrderDocument>,
  IOrder
>(
  {
    user_id: String,
    product_id: String,
    quantity: Number,
    address: String,
    status: String
  },
  {
    collection: 'orders',
    autoIndex: true,
    autoCreate: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

OrderSchema.virtual('_user', {
  ref: MODEL_NAME.USER,
  localField: 'user_id',
  foreignField: 'user_id',
  justOne: true,
});

OrderSchema.virtual('_product', {
  ref: MODEL_NAME.PRODUCT,
  localField: 'product_id',
  foreignField: '_id',
  justOne: true,
});

export default OrderSchema;
