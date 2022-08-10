import { Document } from 'mongoose';

export interface IProduct {
  name: string;
  inventory: number;
}
export interface IProductDocument extends IProduct, Document {}
