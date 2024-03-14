import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column({
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column
  password: string;

  @Column
  name: string;

  @Column
  phone: string;

  @Column
  age: number;
}
