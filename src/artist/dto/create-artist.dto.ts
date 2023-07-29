import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({ description: 'Artist name', example: 'Artist' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Has Grammy', example: 'true' })
  @IsBoolean()
  @IsNotEmpty()
  grammy: boolean;
}
