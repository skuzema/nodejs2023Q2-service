import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Login', example: 'john' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ description: 'Password', example: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }
}
