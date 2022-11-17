import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDBRepository } from '../../driven-adapters/mongo-adapter/user/user.repository';
import { LoginDto, signUpDto } from './dto/auth-dto';
import { HashService } from '../../driven-adapters/hash-password-adapter/hash-password.service';
// import { JwtService } from 'src/infrastructure/driven-adapters/jwt-adapter/jwt.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly auth: UserDBRepository,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService
        // private readonly jwtService: JwtService
    ){}

    async signUp (payload: signUpDto): Promise<object | any> { //TODO: Change method name
        try {
            const { password, ...userData } = payload;
            
            const passwordEncrypted = await this.hashService.hash(password)

            const user = this.auth.create({
                ...userData,
                password: passwordEncrypted
            });

            // return {
            //     user,
            // };
            return user;
        } catch (error) {
            console.log('Down Service - signUp Authentication');
            throw new Error(error);
        }
    }

    async login (payload: LoginDto): Promise<object | any> {
        try {
            const { password: passwordByRequest, email: emailByRequest } = payload;

            const user = await this.auth.findByEmail(emailByRequest);

            const isMatchPassword = await this.hashService.compare(passwordByRequest, user.password);

            if( !isMatchPassword ){
                throw new UnauthorizedException('Credentials are not valid!'); //TODO: Remove password text
            }

            const { email, password, _id } = user;
            console.log('_id: ', _id)

            return {
                email, 
                password,
                // token: this.jwtService.sign({id: _id + ''}) //TODO: Cambiar x id
                token: this.jwtService.sign({id: _id + ''})
            };
            // return user;
        } catch (error) {
            console.log('Down Service - login Authentication');
            throw new Error(error);
        }
    }
  
}
