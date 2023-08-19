import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Payload {
  @ApiProperty({ description: 'User ID', format: 'string' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Login', format: 'string' })
  @IsString()
  @IsNotEmpty()
  login: string;

  constructor(userId: string, login: string) {
    this.userId = userId;
    this.login = login;
  }
}
