import { IMessage } from 'src/domain/common/message/message.interface';

export abstract class IMessageDBRepository {
  abstract create(payload: IMessage): Promise<void>;
  abstract findAllByConversationId(conversationId: string): Promise<IMessage[]>;
  abstract remove(messageId: string): Promise<void>;
}
