import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';


export class PollPk {
    @Type(() => Number)
    @IsInt()
    pollPk: number;
}