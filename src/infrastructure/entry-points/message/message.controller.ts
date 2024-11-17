import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { IMessageDBRepository } from './message.repository.types';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dtos/create.dto';

@Controller('/message')
export class MessageController implements IMessageDBRepository {
  constructor(private readonly service: MessageService) {}

  @Post('/')
  create(@Body() payload: CreateMessageDto) {
    return this.service.create(payload);
  }

  @Get('/findAll/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.service.findAllByUserId(userId);
  }

  @Delete('/remove/:messageId')
  remove(@Param('messageId') messageId: string): Promise<void> {
    return this.service.remove(messageId);
  }
}
