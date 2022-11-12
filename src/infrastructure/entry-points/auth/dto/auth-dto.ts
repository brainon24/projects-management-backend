import { IsString, IsNotEmpty } from 'class-validator';
import { IUser } from '../../../../domain/common/user/user.interface';
import { CreateUserDto } from './user.dto';
import { ILogin } from '../../../../domain/common/user/auth.interface';

export class LoginDto implements ILogin {

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}

export class SignInDto extends CreateUserDto implements IUser {}