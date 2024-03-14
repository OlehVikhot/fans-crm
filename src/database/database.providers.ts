import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { SEQUELIZE } from './constants';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'myuser',
        password: 'mypassword',
        database: 'mydb',
      });
      sequelize.addModels([User]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
