import { User } from './user.entity';
import { USERS_REPOSITORY } from '../database/constants';

export const usersProviders = [
  {
    provide: USERS_REPOSITORY,
    useValue: User,
  },
];
