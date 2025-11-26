import { IsString, IsNotEmpty } from 'class-validator';
import { Schema } from 'mongoose';

export class CreatePasswordResetDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  userId: Schema.Types.ObjectId;
}