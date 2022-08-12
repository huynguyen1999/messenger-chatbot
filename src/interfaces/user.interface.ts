import { Document } from 'mongoose';

export interface IUser {
  user_id: string;
  name: string;
}

export interface IUserDocument extends IUser, Document {}
