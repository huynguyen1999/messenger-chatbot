import { Document } from 'mongoose';

export interface ICart {
  user_id: string;
  product_id: number;
  quantity: string;
}

export interface ICartDocument extends ICart, Document {}
