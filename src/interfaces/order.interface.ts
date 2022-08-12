import { Document } from 'mongoose';

export interface IOrder {
  user_id: string;
  product_id: string;
  quantity: number;
  address: string;
  status: string;
}

export interface IOrderDocument extends IOrder, Document {}
