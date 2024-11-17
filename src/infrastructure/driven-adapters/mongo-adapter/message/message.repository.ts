import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageSpec } from './message.schema';
import { IMessageDBRepository } from 'src/infrastructure/entry-points/message/message.repository.types';
import { IMessage } from 'src/domain/common/message/message.interface';

export class MessageDBRepository implements IMessageDBRepository {
  constructor(@InjectModel('Message') private model: Model<MessageSpec>) {}

  async create(payload: IMessage): Promise<void> {
    try {
      const create = await this.model.create(payload);

      if (!create) {
        throw new BadRequestException('Error al crear al guardar el mensaje.');
      }
    } catch (error) {
      throw new BadRequestException('Error al crear al guardar el mensaje.');
    }
  }

  async findAllByUserId(userId: string): Promise<IMessage[]> {
    try {
      const messages = await this.model.find({ userId }).sort({
        createdAt: -1,
      });

      return messages;
    } catch (error) {
      return [];
    }
  }

  async remove(messageId: string): Promise<void> {
    try {
      const message = await this.model.findByIdAndDelete({ _id: messageId });

      if (!message) {
        throw new NotFoundException(
          'No se encontró ningún mensaje por ese ID.',
        );
      }
    } catch (error) {
      throw new NotFoundException('No se encontró ningún mensaje por ese ID.');
    }
  }
}
