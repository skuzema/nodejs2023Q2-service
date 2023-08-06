import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;

  @ApiProperty()
  version: number;

  @ApiProperty()
  createdAt: number;

  @ApiProperty()
  updatedAt: number;

  @ApiProperty()
  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    this.id = partial.id;
    this.login = partial.login;
    this.version = partial.version;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
    this.password = partial.password;
  }
}
