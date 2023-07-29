import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty()
  @ValidateIf(({ artistId }) => !Object.is(artistId, null))
  @IsString()
  artistId: string | null;
}
