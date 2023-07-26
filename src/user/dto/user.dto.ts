import { Exclude } from 'class-transformer';
import { User } from '../../interfaces';

export class UserDto implements User {
  id: string;
  login: string;

  @Exclude()
  password: string;

  version: number;
  createdAt: number;
  updatedAt: number;
}
