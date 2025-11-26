import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { IUser } from '../../../../domain/common/user/user.interface';
import { CreateUserDto } from './user.dto';
import { ILogin } from '../../../../domain/common/user/auth.interface';

export class LoginDto implements ILogin {
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
}

export class signUpDto extends CreateUserDto implements IUser {}

export class ForgotPasswordDto {
  @IsEmail(
    {},
    {
      message:
        'Ese no parece ser un email válido, por favor ingrese uno válido.',
    },
  )
  @IsNotEmpty()
  email: string;
}

export class ValidateResetTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
