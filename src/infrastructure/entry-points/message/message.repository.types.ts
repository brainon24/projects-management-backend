import { IMessage } from 'src/domain/common/message/message.interface';

export abstract class IMessageDBRepository {
  abstract create(payload: IMessage): Promise<void>;
  abstract findAllByUserId(userId: string): Promise<IMessage[]>;
  abstract remove(messageId: string): Promise<void>;
}
