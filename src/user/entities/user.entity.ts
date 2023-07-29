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
    Object.assign(this, partial);
  }
}
