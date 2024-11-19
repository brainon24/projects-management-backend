import {
  IsString,
  IsMongoId,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Schema } from 'mongoose';
import { IUser } from './user.interface';
import { Role } from './user-role.enum';

export class UserDto implements IUser {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsMongoId()
  businessId: Schema.Types.ObjectId;
}
