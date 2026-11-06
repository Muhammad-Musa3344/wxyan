
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100000)
  html: string;

  @IsMongoId()
  authorId: string;
}
