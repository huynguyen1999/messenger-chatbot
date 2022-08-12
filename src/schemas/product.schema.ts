import * as mongoose from 'mongoose';
import { IProduct, IProductDocument } from 'src/interfaces';

const ProductSchema = new mongoose.Schema<
  IProductDocument,
  mongoose.Model<IProductDocument>,
  IProduct
>(
  {
    name: String,
    inventory: Number,
  },
  {
    collection: 'products',
    autoIndex: true,
    autoCreate: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default ProductSchema;
