import { Injectable } from '@nestjs/common';
import { UserDBRepository } from '../../driven-adapters/mongo-adapter/user/user.repository';
import { User } from './entities/user.entity';
import { IUserDBRepository } from './user.repository.types';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService implements IUserDBRepository {
  constructor(private readonly user: UserDBRepository) {}

  create(payload: CreateUserDto): Promise<User> {
    return this.user.create(payload);
  }

  findById(id: string): Promise<User> {
    return this.user.findById(id);
  }

  findByPhone(phone: string): Promise<User> {
    return this.user.findByPhone(phone);
  }

  findByName(name: string, lastName: string): Promise<User[]> {
    return this.user.findByName(name, lastName);
  }

  findByEmail(email: string): Promise<User> {
    return this.user.findByEmail(email);
  }

  findAll(): Promise<User[]> {
    return this.user.findAll();
  }

  async findByBusinessId(businessId: string): Promise<User[]> {
    return await this.user.findByBusinessId(businessId);
  }

  findAllByRole(role: string): Promise<User | User[]> {
    return this.user.findAllByRole(role);
  }

  updateRole(_id: string, role: string): Promise<User> {
    return this.user.updateRole(_id, role);
  }

  delete(id: string): Promise<void> {
    return this.user.delete(id);
  }
}
