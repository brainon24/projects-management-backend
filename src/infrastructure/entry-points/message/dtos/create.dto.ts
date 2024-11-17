import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IMessage } from 'src/domain/common/message/message.interface';

export class CreateMessageDto implements IMessage {
  @IsNotEmpty()
  @IsMongoId()
  userId: any;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  attachment: string;

  @IsOptional()
  @IsString()
  attachmentType: string;
}
