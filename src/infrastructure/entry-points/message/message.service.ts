import { Injectable } from '@nestjs/common';
import { IMessageDBRepository } from './message.repository.types';
import { MessageDBRepository } from 'src/infrastructure/driven-adapters/mongo-adapter/message/message.repository';
import { IMessage } from 'src/domain/common/message/message.interface';

@Injectable()
export class MessageService implements IMessageDBRepository {
  constructor(private readonly repository: MessageDBRepository) {}

  create(payload: IMessage) {
    return this.repository.create(payload);
  }

  findAllByConversationId(conversationId: any) {
    return this.repository.findAllByConversationId(conversationId);
  }

  remove(messageId: string): Promise<void> {
    return this.repository.remove(messageId);
  }
}
