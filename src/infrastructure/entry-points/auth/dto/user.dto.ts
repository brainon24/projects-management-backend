import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsPositive,
  Length,
} from 'class-validator';
import { Schema } from 'mongoose';
import { IUser } from '../../../../domain/common/user/user.interface';
import { Role } from '../../../../domain/common/user/user-role.enum';

export class CreateUserDto implements IUser {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  @Length(10, 10)
  phone?: string;

  @IsEmail(
    {},
    {
      message:
        'Ese no parece ser un email válido, por favor ingrese uno válido.',
    },
  )
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsString()
  @IsNotEmpty()
  businessId: Schema.Types.ObjectId;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
