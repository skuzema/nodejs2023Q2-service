import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @ValidateIf(({ artistId }) => !Object.is(artistId, null))
  @IsString()
  artistId: string | null;

  @ApiProperty()
  @ValidateIf(({ albumId }) => !Object.is(albumId, null))
  @IsString()
  albumId: string | null;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
