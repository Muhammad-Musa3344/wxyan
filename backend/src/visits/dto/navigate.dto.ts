import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class NavigateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  address: string;

  @IsOptional()
  @IsObject()
  state?: Record<string, unknown>;
}