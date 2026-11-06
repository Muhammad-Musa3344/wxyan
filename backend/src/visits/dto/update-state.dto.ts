
import { IsObject } from 'class-validator';

export class UpdateStateDto {
  @IsObject()
  state: Record<string, unknown>;
}
