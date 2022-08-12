import * as mongoose from 'mongoose';
import { IUser, IUserDocument } from 'src/interfaces';

const UserSchema = new mongoose.Schema<
  IUserDocument,
  mongoose.Model<IUserDocument>,
  IUser
>(
  {
    name: String,
    user_id: String,
  },
  {
    collection: 'users',
    autoIndex: true,
    autoCreate: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default UserSchema;
