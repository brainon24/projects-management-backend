import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDBRepository } from '../../driven-adapters/mongo-adapter/user/user.repository';
import { LoginDto, signUpDto, ForgotPasswordDto, ValidateResetTokenDto, ResetPasswordDto } from './dto/auth-dto';
import { HashService } from '../../driven-adapters/hash-password-adapter/hash-password.service';
import { BusinessService } from '../business/business.service';
import { MailService } from '../../driven-adapters/mail-adapter/service';
import { PasswordResetDBRepository } from '../../driven-adapters/mongo-adapter/password-reset/password-reset.repository';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly auth: UserDBRepository,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly businessService: BusinessService,
    private readonly mailService: MailService,
    private readonly passwordResetRepository: PasswordResetDBRepository,
  ) {}

  async signUp(payload: signUpDto): Promise<object | any> {
    try {
      const { password, ...userData } = payload;

      const passwordEncrypted = await this.hashService.hash(password);

      const { businessId } = userData;

      const business = await this.businessService.findById(businessId);

      if (!business) {
        throw new UnauthorizedException(
          'No se encontro ningún negocio por ese ID, por favor comuníquese con el administrador.',
        );
      }

      const user = await this.auth.create({
        ...userData,
        password: passwordEncrypted,
      });

      return {
        user,
        token: this.jwtService.sign({ id: (await user)._id + '' }),
      };
    } catch (error) {
      // console.log(error)
      throw new UnauthorizedException(error.response.message);
    }
  }

  async login(payload: LoginDto): Promise<object | any> {
    try {
      const { password: passwordByRequest, email: emailByRequest } = payload;

      const user: any = await this.auth.findByEmail(emailByRequest);
      const { password, ...restDataUser } = user;

      const isMatchPassword = await this.hashService.compare(
        passwordByRequest,
        password,
      );

      if (!isMatchPassword) {
        throw new UnauthorizedException(
          'Credenciales incorrectas, por favor verifiquelas y vuelva a intentarlo.',
        );
      }

      return {
        user: restDataUser,
        token: this.jwtService.sign({ id: restDataUser._id + '' }),
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Credenciales incorrectas, por favor verifiquelas y vuelva a intentarlo.',
      );
    }
  }

  async checkToken(req: Request) {
    const token = req.headers['x-token'];

    // if( !token ) return new UnauthorizedException('Su token ha expirado o no hay token dentro de la petición.');
    if (!token) return;

    try {
      const { id } = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.auth.findById(id);

      return {
        user,
        token,
      };
    } catch (error) {
      //TODO: Si se cambia este mensaje se debe cambiar en el front la validación del useEffect en el App.tsx
      throw new UnauthorizedException(
        'Se ha expirado tu sesión, por favor inicia sesión nuevamente.',
      );
    }
  }

  async forgotPassword(payload: ForgotPasswordDto): Promise<object> {
    try {
      const { email } = payload;

      const user = await this.auth.findByEmail(email);
      
      if (!user?._id) {
        throw new BadRequestException(
          'Parece que no hay ningún usuario registrado con ese correo electrónico.',
        );
      }

      const resetToken = crypto?.randomBytes(32).toString('hex');
      
      await this.passwordResetRepository.create({
        token: resetToken,
        userId: user._id,
      });

      await this.mailService.sendPasswordReset(email, user.fullName, resetToken);

      return {
        success: true,
        message: 'Si el correo electrónico está registrado, recibirás las instrucciones para restablecer tu contraseña.',
      };

    } catch (error) {
      throw new BadRequestException(
        'Error al procesar la solicitud de recuperación de contraseña. Inténtalo de nuevo más tarde.',
      );
    }
  }

  async validateResetToken(token: string): Promise<any> {
    try {
      const resetRecord = await this.passwordResetRepository.findByToken(token);
      
      const user = await this.auth.findById((resetRecord?.userId as any)?._id);
      
      return {
        valid: true,
        userId: resetRecord.userId,
        user: user,
      };
    } catch (error) {
      throw new BadRequestException('Token de recuperación no válido o expirado.');
    }
  }

  async consumeResetToken(token: string): Promise<void> {
    try {
      await this.passwordResetRepository.findByToken(token);
      
      await this.passwordResetRepository.deleteByToken(token);
    } catch (error) {
      throw new BadRequestException('Token de recuperación no válido o expirado.');
    }
  }

  async validateResetTokenEndpoint(payload: ValidateResetTokenDto): Promise<object> {
    try {
      const { token } = payload;
      
      const resetRecord = await this.passwordResetRepository.findByTokenSafe(token);
      
      if (!resetRecord?.token) {
        return {
          valid: false,
          message: 'Token de recuperación no válido o expirado.',
        };
      }

      const userId = (resetRecord?.userId as any)?._id;
      const user = await this.auth.findById(userId);
      
      return {
        valid: true,
        message: 'Token válido',
        userId: (resetRecord.userId as any)?._id,
        email: user.email,
      };
    } catch (error) {
      console.error('Error validando token:', error);
      return {
        valid: false,
        message: 'Token de recuperación no válido o expirado.',
      };
    }
  }

  async resetPassword(payload: ResetPasswordDto): Promise<object> {
    try {
      const { token, newPassword } = payload;

      const tokenValidation = await this.validateResetToken(token);
      const userId = tokenValidation.userId._id;

      const hashedPassword = await this.hashService.hash(newPassword);

      await this.auth.updatePassword(userId, hashedPassword);

      await this.consumeResetToken(token);

      return {
        success: true,
        message: 'Contraseña actualizada correctamente.',
      };

    } catch (error) {
      console.error('Error en resetPassword:', error);
      
      if (error.message.includes('Token de recuperación no válido')) {
        throw new BadRequestException('Token de recuperación no válido o expirado.');
      }

      throw new BadRequestException(
        'Error al actualizar la contraseña. Inténtalo de nuevo más tarde.',
      );
    }
  }

  async debugTokens(): Promise<object> {
    try {
      const allTokens = await this.passwordResetRepository.getAllTokensForDebug();
      
      return {
        totalTokens: allTokens.length,
        tokens: allTokens.map(token => ({
          token: token.token.substring(0, 10) + '...',
          userId: token.userId,
          createdAt: token.createdAt,
          timeAgo: Math.floor((Date.now() - new Date(token.createdAt).getTime()) / 1000) + ' segundos',
        })),
        currentTime: new Date(),
      };
    } catch (error) {
      return {
        error: 'Error al obtener tokens para debug',
        message: error.message,
      };
    }
  }

  async forceTTLIndex(): Promise<object> {
    try {
      await this.passwordResetRepository.ensureTTLIndex();
      return {
        success: true,
        message: 'Índice TTL creado/actualizado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al crear índice TTL',
        message: error.message,
      };
    }
  }
}
