import * as mongoose from 'mongoose';
import { IFollower, IFollowerDocument } from 'src/interfaces';

const FollowerSchema = new mongoose.Schema<
  IFollowerDocument,
  mongoose.Model<IFollowerDocument>,
  IFollower
>(
  {
    name: String,
    messenger_id: String,
  },
  {
    collection: 'zalo-messages',
    autoIndex: true,
    autoCreate: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default FollowerSchema;
