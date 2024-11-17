export interface IMessage {
  _id?: any;
  userId: any;
  content: string;
  attachment: string;
  attachmentType: string;
  createdAt?: Date | string;
}
