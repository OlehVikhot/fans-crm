import * as argon from 'argon2';
import { Response } from 'express';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto, SignUpDto } from './dto';
import { USERS_REPOSITORY } from '../database/constants';
import { User } from '../users/user.entity';
import { setup } from '../../setup';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: typeof User,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignUpDto) {
    const hash = await argon.hash(dto.password);

    const user = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (user) {
      throw new ForbiddenException('Credentials taken');
    }

    const newUser = await this.usersRepository.create({
      email: dto.email.toLowerCase(),
      password: hash,
    });

    return this.signToken(newUser.id, newUser.email);
  }

  async signin(dto: SignInDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new UnauthorizedException('Please reset your password');
    }

    const passwordCorrect = await argon.verify(user.password, dto.password);

    if (!passwordCorrect) {
      throw new UnauthorizedException('Wrong credentials');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.configService.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: setup.accessTokenLifetime,
      secret,
    });
    return {
      access_token: token,
    };
  }

  setAccessTokenCookie(res: Response, access_token: string) {
    const expires = new Date(Date.now() + setup.accessTokenLifetime);
    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires,
    });
  }

  invalidateAccessTokenCookie(res: Response) {
    res.cookie('access_token', null, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(0),
    });
  }
}
