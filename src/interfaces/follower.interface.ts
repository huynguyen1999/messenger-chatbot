import { Document } from 'mongoose';

export interface IFollower {
  name: string;
  messenger_id: string;
}

export interface IFollowerDocument extends IFollower, Document {}
