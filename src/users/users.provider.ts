import { User } from './user.entity';

export const usersProviders = [
  {
    provide: 'CATS_REPOSITORY',
    useValue: User,
  },
];
