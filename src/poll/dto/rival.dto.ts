import { MaxLength, MinLength } from "class-validator";

export class RivalDto {
    @MinLength(1)
    @MaxLength(30)
    rivalName: string
}