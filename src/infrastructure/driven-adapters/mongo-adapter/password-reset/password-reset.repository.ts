import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordResetSpec } from './password-reset.schema';
import { CreatePasswordResetDto } from 'src/domain/common/password-reset/password-reset.dto';
import { IPasswordReset } from 'src/domain/common/password-reset/password-reset.interface';
import { IPasswordResetDBRepository } from './password-reset.repository.types';

@Injectable()
export class PasswordResetDBRepository implements IPasswordResetDBRepository {
  constructor(
    @InjectModel('PasswordReset')
    private passwordResetModel: Model<PasswordResetSpec>,
  ) {}

  async create(payload: CreatePasswordResetDto): Promise<IPasswordReset> {
    try {
      await this.deleteByUserId(payload.userId.toString());
      
      const passwordReset = new this.passwordResetModel({
        ...payload,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15),
      });
      return await passwordReset.save();
    } catch (error) {
      // Si el error es por token duplicado, intentar eliminarlo y crear nuevamente
      if (error.code === 11000) {
        await this.deleteByToken(payload.token);
        const passwordReset = new this.passwordResetModel(payload);
        return await passwordReset.save();
      }
      throw new BadRequestException(
        'Error al crear el token de recuperación de contraseña.',
      );
    }
  }

  async findByToken(token: string): Promise<IPasswordReset> {
    try {
      const passwordReset = await this.passwordResetModel
        .findOne({ token })
        .populate('userId');

      if (!passwordReset) {
        throw new NotFoundException(
          'Token de recuperación no válido o expirado.',
        );
      }

      return passwordReset;
    } catch (error) {
      throw new NotFoundException(
        'Token de recuperación no válido o expirado.',
      );
    }
  }

  async findByTokenSafe(token: string): Promise<IPasswordReset | null> {
    try {
      const passwordReset = await this.passwordResetModel
        .findOne({ token })
        .populate('userId');

      return passwordReset;
    } catch (error) {
      console.error('Error buscando token:', error);
      return null;
    }
  }

  async findByUserId(userId: string): Promise<IPasswordReset[]> {
    try {
      return await this.passwordResetModel.find({ userId });
    } catch (error) {
      return [];
    }
  }

  async deleteByToken(token: string): Promise<void> {
    try {
      await this.passwordResetModel.deleteOne({ token });
    } catch (error) {
      console.error('Error al eliminar token:', error);
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    try {
      await this.passwordResetModel.deleteMany({ userId });
    } catch (error) {
      console.error('Error al eliminar tokens del usuario:', error);
    }
  }

  async getAllTokensForDebug(): Promise<IPasswordReset[]> {
    try {
      return await this.passwordResetModel.find({}).populate('userId');
    } catch (error) {
      console.error('Error al obtener tokens para debug:', error);
      return [];
    }
  }

  async ensureTTLIndex(): Promise<void> {
    try {
      // Verificar índices existentes
      const indexes = await this.passwordResetModel.collection.getIndexes();
      console.log('Índices existentes en passwordresets:', indexes);

      // Crear/recrear el índice TTL
      await this.passwordResetModel.collection.createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 20, background: true }
      );
      console.log('Índice TTL creado/actualizado correctamente');
    } catch (error) {
      console.error('Error creando índice TTL:', error);
    }
  }
}