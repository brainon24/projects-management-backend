import { Schema } from 'mongoose';

export interface IPasswordReset {
  _id?: Schema.Types.ObjectId;
  token: string;
  userId: Schema.Types.ObjectId;
  createdAt?: Date;
}