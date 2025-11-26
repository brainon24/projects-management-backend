import { CreatePasswordResetDto } from 'src/domain/common/password-reset/password-reset.dto';
import { IPasswordReset } from 'src/domain/common/password-reset/password-reset.interface';

export interface IPasswordResetDBRepository {
  create(payload: CreatePasswordResetDto): Promise<IPasswordReset>;
  findByToken(token: string): Promise<IPasswordReset>;
  findByTokenSafe(token: string): Promise<IPasswordReset | null>;
  findByUserId(userId: string): Promise<IPasswordReset[]>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  getAllTokensForDebug(): Promise<IPasswordReset[]>;
  ensureTTLIndex(): Promise<void>;
}