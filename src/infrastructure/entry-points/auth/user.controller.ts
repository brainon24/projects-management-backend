import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IUserDBRepository } from './user.repository.types';
import { CreateUserDto } from './dto/user.dto';

@Controller('/user')
export class UserController implements IUserDBRepository {
  constructor(private readonly userService: UserService) {}

  @Post('/create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/findById/:id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post('/findByName')
  findByName(@Body() payload: any) {
    const { name, lastName } = payload;
    return this.userService.findByName(name, lastName);
  }

  @Post('/findByEmail')
  findByEmail(@Body() payload: any) {
    const { email } = payload;
    return this.userService.findByEmail(email);
  }

  @Get('/findByPhone/:phone')
  findByPhone(@Param('phone') phone: any) {
    return this.userService.findByPhone(phone);
  }

  @Get('/findByBusinessId/:id')
  findByBusinessId(@Param('id') id: any) {
    return this.userService.findByBusinessId(id);
  }

  @Get('/findAll')
  findAll() {
    return this.userService.findAll();
  }

  @Get('/findAllByRole/:role')
  findAllByRole(@Param('role') role: string) {
    return this.userService.findAllByRole(role); //TODO: Optimizar el servicio
  }

  @Patch('/updateRole/:_id')
  updateRole(@Param('_id') _id: string, @Body() payload: any) {
    const { role } = payload;
    return this.userService.updateRole(_id, role);
  }

  @Delete('/delete/:id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
