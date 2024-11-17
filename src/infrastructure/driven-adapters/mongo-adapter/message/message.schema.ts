import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IMessage } from 'src/domain/common/message/message.interface';

@Schema({
  toJSON: {
    virtuals: true,
    transform: function (doc: any, ret: any) {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  timestamps: true,
  versionKey: false,
})
export class MessageSpec extends Document implements IMessage {
  @Prop({
    type: Types.ObjectId,
    require: true,
    trim: true,
    ref: 'User',
  })
  userId: any;
  @Prop({
    type: String,
    require: false,
    trim: true,
  })
  content: string;
  @Prop({
    type: String,
    require: false,
    trim: true,
  })
  attachment: string;
  @Prop({
    type: String,
    require: false,
    trim: true,
  })
  attachmentType: string;
}

export const MessageSchema = SchemaFactory.createForClass(MessageSpec);
