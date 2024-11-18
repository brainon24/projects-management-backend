import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsPositive,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';
import { Schema } from 'mongoose';
import { IUser } from '../../../../domain/common/user/user.interface';
import { Role } from '../../../../domain/common/user/user-role.enum';

@ValidatorConstraint({ name: 'isTenDigitNumber', async: false })
export class IsTenDigitNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(phone: number) {
    return phone.toString().length === 10;
  }

  defaultMessage() {
    return 'El número de celular debe tener exactamente 10 dígitos.';
  }
}

export class CreateUserDto implements IUser {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsNumber()
  @IsOptional()
  @Validate(IsTenDigitNumberConstraint)
  @IsPositive({
    message:
      'Ese no parece ser un número de celular válido, por favor ingrese uno válido.',
  })
  phone?: number;

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
