import { Document } from 'mongoose';

export interface ICart {
  product: string;
  quantity: number;
  follower: string;
}

export interface ICartDocument extends ICart, Document {}
