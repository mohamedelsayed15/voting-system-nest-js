import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PageQuery {
  @Type(() => Number)
  @IsInt()
  page: number;
}
