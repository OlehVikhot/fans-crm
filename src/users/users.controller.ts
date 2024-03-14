import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guard';
import { AddUserDto } from './dto/users.dto';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Put('users')
  async addUser(@Body() dto: AddUserDto) {
    return this.usersService.addUser(dto);
  }

  @UseGuards(JwtGuard)
  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }
}
