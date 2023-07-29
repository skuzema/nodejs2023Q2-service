import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ description: 'Album name', example: 'Sample' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Album year', example: '2000' })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ description: 'Artist id', example: 'id' })
  @ValidateIf(({ artistId }) => !Object.is(artistId, null))
  @IsString()
  artistId: string | null;
}
