import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({ description: 'Track name', example: 'Track1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Artist id', example: '' })
  @ValidateIf(({ artistId }) => !Object.is(artistId, null))
  @IsString()
  artistId: string | null;

  @ApiProperty({ description: 'Album id', example: '' })
  @ValidateIf(({ albumId }) => !Object.is(albumId, null))
  @IsString()
  albumId: string | null;

  @ApiProperty({ description: 'Duration', example: '3' })
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
