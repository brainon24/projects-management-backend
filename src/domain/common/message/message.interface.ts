export interface IMessage {
  _id?: any;
  conversationId: any;
  author: any;
  content: string;
  attachment: string;
  attachmentType: string;
  createdAt?: Date | string;
}
