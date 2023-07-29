import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'Previous password', example: 'old_password' })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: 'New password', example: 'new_password' })
  @IsNotEmpty()
  newPassword: string;
}
