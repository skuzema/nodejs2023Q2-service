import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Login', example: 'john' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ description: 'Password', example: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
