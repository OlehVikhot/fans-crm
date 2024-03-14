import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './user.entity';
import { USERS_REPOSITORY } from '../database/constants';
import { AddUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: typeof User,
  ) {}

  async addUser(dto: AddUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ForbiddenException('User with this email already exists');
    }

    return this.usersRepository.create({ ...dto });
  }

  async getUser(id: string) {
    const user = await this.usersRepository.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user };
  }
}
