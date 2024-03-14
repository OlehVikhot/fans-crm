import { IsNumber, IsString } from 'class-validator';

export class AddUserDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsNumber()
  age: number;
}
